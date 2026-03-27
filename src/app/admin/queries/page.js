'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { MessageSquare, Trash2, Mail, Phone, Clock, AlertCircle } from 'lucide-react';

export default function QueriesPage() {
  const { data: session } = useSession();
  const [queries, setQueries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    // We fetch queries. Assuming queryRoutes are public for GET or protected (we should send token just in case)
    if (session?.accessToken) fetchQueries();
  }, [session]);

  const fetchQueries = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${apiUrl}/api/queries/all`, {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      setQueries(res.data);
    } catch (error) {
      toast.error('Failed to fetch queries');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`${apiUrl}/api/queries/${id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      toast.success(`Query marked as ${newStatus}`);
      fetchQueries();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this query?')) return;
    try {
      await axios.delete(`${apiUrl}/api/queries/${id}`, {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      toast.success("Query deleted");
      fetchQueries();
    } catch (error) {
      toast.error("Failed to delete query");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'Contacted': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Resolved': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-500/10 rounded-xl">
          <MessageSquare className="h-6 w-6 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Customer Queries</h1>
          <p className="text-slate-400 mt-1">Manage leads and messages from the contact form.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-slate-400">Loading queries...</div>
        ) : queries.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-slate-500 opacity-50" />
            <p>Inbox is empty! No new inquiries.</p>
          </div>
        ) : (
          queries.map((q) => (
            <div key={q._id} className="bg-[#0F172A] rounded-2xl border border-slate-800 shadow-xl overflow-hidden hover:border-slate-700 transition-colors group flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{q.name}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                      <a href={`mailto:${q.email}`} className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors">
                        <Mail className="w-4 h-4" /> {q.email}
                      </a>
                      {q.phone && (
                        <a href={`tel:${q.phone}`} className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors">
                          <Phone className="w-4 h-4" /> {q.phone}
                        </a>
                      )}
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full border tracking-wide ${getStatusColor(q.status)}`}>
                    {q.status}
                  </span>
                </div>
                
                <div className="bg-[#0B1120] rounded-xl p-4 border border-slate-800/50 mb-4">
                  <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">{q.message}</p>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  Sent {new Date(q.createdAt).toLocaleString()}
                </div>
              </div>
              
              <div className="bg-slate-800/30 px-6 py-4 border-t border-slate-800 flex justify-between items-center mt-auto">
                <select 
                  value={q.status} 
                  onChange={(e) => handleStatusChange(q._id, e.target.value)}
                  className="bg-[#0B1120] border border-slate-700 text-sm rounded-lg px-3 py-2 text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="New">Mark as New</option>
                  <option value="Contacted">Mark as Contacted</option>
                  <option value="Resolved">Mark as Resolved</option>
                </select>
                
                <button 
                  onClick={() => handleDelete(q._id)}
                  className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors flex items-center justify-center"
                  title="Delete Query"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
