'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { AppWindow, Plus, Trash2, Image, Users, MessageSquareQuote, HelpCircle, Save } from 'lucide-react';

export default function ContentCMS() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('coaches');
  const [data, setData] = useState({ coaches: [], gallery: [], testimonials: [], faqs: [] });
  const [loading, setLoading] = useState(false);
  
  // Forms states
  const [coachForm, setCoachForm] = useState({ name: '', role: '', imageBase64: '' });
  const [galleryForm, setGalleryForm] = useState({ title: '', imageBase64: '' });
  const [testForm, setTestForm] = useState({ clientName: '', content: '', rating: 5 });
  const [faqForm, setFaqForm] = useState({ question: '', answer: '' });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [cRes, gRes, tRes, fRes] = await Promise.all([
        axios.get(`${apiUrl}/api/content/coaches`),
        axios.get(`${apiUrl}/api/content/gallery`),
        axios.get(`${apiUrl}/api/content/testimonials`),
        axios.get(`${apiUrl}/api/content/faqs`)
      ]);
      setData({ coaches: cRes.data, gallery: gRes.data, testimonials: tRes.data, faqs: fRes.data });
    } catch (err) { toast.error("Failed to load content"); }
  };

  const handleImageResize = (file, callback) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => callback(reader.result);
    reader.readAsDataURL(file);
  };

  const handleCreate = async (endpoint, payload, resetFn) => {
    if (!session?.accessToken) return;
    setLoading(true);
    try {
      await axios.post(`${apiUrl}/api/content/${endpoint}`, payload, {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      toast.success("Added successfully!");
      resetFn();
      fetchAll();
    } catch (err) { toast.error("Failed to add component"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (endpoint, id) => {
    if (!confirm('Delete this item completely from public view?')) return;
    try {
      await axios.delete(`${apiUrl}/api/content/${endpoint}/${id}`, {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      toast.success("Deleted permanently.");
      fetchAll();
    } catch (err) { toast.error("Failed to delete."); }
  };

  const renderTabs = () => (
    <div className="flex flex-wrap gap-2 mb-8">
      {[
        { id: 'coaches', icon: Users, label: 'Manage Staff' },
        { id: 'gallery', icon: Image, label: 'Photo Gallery' },
        { id: 'testimonials', icon: MessageSquareQuote, label: 'Testimonials' },
        { id: 'faqs', icon: HelpCircle, label: 'FAQs' }
      ].map(tab => (
        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
          className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === tab.id ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-[#0F172A] text-slate-400 hover:text-white border border-slate-800 hover:bg-[#1a2333]'}`}
        >
          <tab.icon className="w-4 h-4" /> {tab.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-amber-500/10 rounded-xl">
          <AppWindow className="h-6 w-6 text-amber-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Website Content CMS</h1>
          <p className="text-slate-400 mt-1">Upload images and manage text dynamically displayed on the public homepage.</p>
        </div>
      </div>

      {renderTabs()}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Creation Form */}
        <div className="lg:col-span-1 border border-slate-800 bg-[#0F172A] rounded-2xl p-6 shadow-xl h-fit">
          <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">Create New</h2>
          
          {activeTab === 'coaches' && (
            <form onSubmit={(e) => { e.preventDefault(); handleCreate('coaches', coachForm, () => setCoachForm({name:'', role:'', imageBase64:''}))}} className="space-y-4">
               <input required type="text" placeholder="Coach Name" value={coachForm.name} onChange={e=>setCoachForm({...coachForm, name: e.target.value})} className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
               <input required type="text" placeholder="Specialty (e.g. Strength)" value={coachForm.role} onChange={e=>setCoachForm({...coachForm, role: e.target.value})} className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
               <div className="border border-dashed border-slate-700 rounded-xl p-4 text-center hover:bg-white/5 transition">
                 <label className="cursor-pointer">
                   <span className="text-amber-500 font-bold block mb-1">Select Photo</span>
                   <span className="text-xs text-slate-400">High quality allowed</span>
                   <input required type="file" accept="image/*" className="hidden" onChange={(e) => handleImageResize(e.target.files[0], (d)=>setCoachForm({...coachForm, imageBase64: d}))} />
                 </label>
               </div>
               {coachForm.imageBase64 && <img src={coachForm.imageBase64} className="w-20 h-20 rounded-lg object-cover mx-auto" />}
               <button type="submit" disabled={loading} className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl">Add Coach</button>
            </form>
          )}

          {activeTab === 'gallery' && (
            <form onSubmit={(e) => { e.preventDefault(); handleCreate('gallery', galleryForm, () => setGalleryForm({title:'', imageBase64:''}))}} className="space-y-4">
               <input required type="text" placeholder="Image Title (e.g. Cardio Zone)" value={galleryForm.title} onChange={e=>setGalleryForm({...galleryForm, title: e.target.value})} className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
               <div className="border border-dashed border-slate-700 rounded-xl p-4 text-center hover:bg-white/5 transition">
                 <label className="cursor-pointer">
                   <span className="text-amber-500 font-bold block mb-1">Select Full Image</span>
                   <span className="text-xs text-slate-400">Landscape preferred</span>
                   <input required type="file" accept="image/*" className="hidden" onChange={(e) => handleImageResize(e.target.files[0], (d)=>setGalleryForm({...galleryForm, imageBase64: d}))} />
                 </label>
               </div>
               {galleryForm.imageBase64 && <img src={galleryForm.imageBase64} className="w-full h-32 rounded-lg object-cover mx-auto" />}
               <button type="submit" disabled={loading} className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl">Upload Gallery Photo</button>
            </form>
          )}

          {activeTab === 'testimonials' && (
            <form onSubmit={(e) => { e.preventDefault(); handleCreate('testimonials', testForm, () => setTestForm({clientName:'', content:'', rating:5}))}} className="space-y-4">
               <input required type="text" placeholder="Client Name" value={testForm.clientName} onChange={e=>setTestForm({...testForm, clientName: e.target.value})} className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
               <textarea required placeholder="What did they say?" rows={4} value={testForm.content} onChange={e=>setTestForm({...testForm, content: e.target.value})} className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"></textarea>
               <input required type="number" min="1" max="5" placeholder="Rating (1-5)" value={testForm.rating} onChange={e=>setTestForm({...testForm, rating: e.target.value})} className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
               <button type="submit" disabled={loading} className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl">Add Testimonial</button>
            </form>
          )}

          {activeTab === 'faqs' && (
            <form onSubmit={(e) => { e.preventDefault(); handleCreate('faqs', faqForm, () => setFaqForm({question:'', answer:''}))}} className="space-y-4">
               <input required type="text" placeholder="Common Question" value={faqForm.question} onChange={e=>setFaqForm({...faqForm, question: e.target.value})} className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
               <textarea required placeholder="Official Answer" rows={4} value={faqForm.answer} onChange={e=>setFaqForm({...faqForm, answer: e.target.value})} className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"></textarea>
               <button type="submit" disabled={loading} className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl">Add FAQ</button>
            </form>
          )}
        </div>

        {/* Live Preview List */}
        <div className="lg:col-span-2 space-y-4">
           {activeTab === 'coaches' && data.coaches.map(c => (
              <div key={c._id} className="flex flex-col sm:flex-row items-center gap-4 bg-[#0F172A] p-4 rounded-xl border border-slate-800">
                 <img src={c.imageBase64} className="w-20 h-20 rounded-full object-cover shadow-lg border-2 border-slate-700" />
                 <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg font-bold text-white">{c.name}</h3>
                    <p className="text-amber-500">{c.role}</p>
                 </div>
                 <button onClick={() => handleDelete('coaches', c._id)} className="p-2 text-slate-500 hover:text-red-500 transition"><Trash2 /></button>
              </div>
           ))}

           {activeTab === 'gallery' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                 {data.gallery.map(img => (
                   <div key={img._id} className="group relative aspect-square rounded-xl overflow-hidden border border-slate-800 bg-black">
                      <img src={img.imageBase64} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition duration-500 group-hover:scale-110" />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-3 opacity-0 group-hover:opacity-100 transition">
                         <p className="text-white text-sm font-bold truncate">{img.title}</p>
                         <button onClick={() => handleDelete('gallery', img._id)} className="mt-2 text-xs text-red-400 font-bold hover:text-red-300">DELETE PHOTO</button>
                      </div>
                   </div>
                 ))}
              </div>
           )}

           {activeTab === 'testimonials' && data.testimonials.map(t => (
             <div key={t._id} className="bg-[#0F172A] p-5 rounded-xl border border-slate-800 relative">
                 <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-amber-500 text-lg">{t.clientName}</h3>
                    <div className="flex text-yellow-500 text-sm">{'★'.repeat(t.rating)}</div>
                 </div>
                 <p className="text-slate-300 italic">"{t.content}"</p>
                 <button onClick={() => handleDelete('testimonials', t._id)} className="absolute top-4 right-4 text-slate-500 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
             </div>
           ))}

           {activeTab === 'faqs' && data.faqs.map(f => (
             <div key={f._id} className="bg-[#0F172A] p-5 rounded-xl border border-slate-800 relative">
                 <h3 className="font-bold text-white pr-8 mb-2">Q: {f.question}</h3>
                 <p className="text-slate-400 text-sm border-l-2 border-amber-500 pl-3">A: {f.answer}</p>
                 <button onClick={() => handleDelete('faqs', f._id)} className="absolute top-5 right-5 text-slate-500 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
