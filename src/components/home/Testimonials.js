'use client';
import { useState, useEffect } from "react";
import axios from "axios";
import { Star, Quote } from "lucide-react";

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/content/testimonials`);
        setReviews(res.data);
      } catch (err) { console.error("Error fetching testimonials", err); }
    };
    fetchReviews();
  }, [apiUrl]);

  if (reviews.length === 0) return null;

  return (
    <section className="py-24 bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
            Client <span className="text-amber-500">Success</span>
          </h2>
          <p className="text-zinc-400 mt-4 text-base">Real results from our dedicated members</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((t) => (
            <div
              key={t._id}
              className="bg-[#111111] p-8 rounded-3xl border border-white/5 hover:border-amber-500/30 transition-colors duration-500 relative"
            >
              <Quote className="absolute top-8 right-8 text-white/5 w-12 h-12" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(t.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />
                ))}
              </div>
              
              <p className="text-zinc-300 mb-8 italic text-lg leading-relaxed relative z-10">
                "{t.content}"
              </p>
              
              <div>
                <h4 className="font-bold text-white uppercase tracking-wide">
                  {t.clientName}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
