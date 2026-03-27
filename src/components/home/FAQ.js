'use client';
import { useState, useEffect } from "react";
import axios from "axios";
import { ChevronDown } from "lucide-react";

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(0);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/content/faqs`);
        setFaqs(res.data);
      } catch (err) { console.error("Error fetching FAQs", err); }
    };
    fetchFAQs();
  }, [apiUrl]);

  if (faqs.length === 0) return null;

  return (
    <section className="py-24 bg-[#0a0a0a] text-white">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
            Got <span className="text-amber-500">Questions?</span>
          </h2>
          <p className="text-zinc-400 mt-4 text-lg">Everything you need to know about joining XYZ.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={faq._id}
              className={`border border-white/10 rounded-2xl overflow-hidden transition-colors ${
                openIndex === i ? "bg-[#111111]" : "hover:bg-white/5"
              }`}
            >
               <button
                 className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-lg"
                 onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
               >
                 <span>{faq.question}</span>
                 <ChevronDown
                   className={`w-5 h-5 text-amber-500 transition-transform duration-300 shrink-0 ${
                     openIndex === i ? "rotate-180" : ""
                   }`}
                 />
               </button>
               
               <div
                 className={`overflow-hidden transition-all duration-300 ${
                   openIndex === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                 }`}
               >
                 <p className="px-6 pb-6 text-zinc-400 leading-relaxed">
                   {faq.answer}
                 </p>
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
