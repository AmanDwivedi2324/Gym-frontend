'use client';
import { useState, useEffect } from "react";
import axios from "axios";

export default function Staff() {
  const [team, setTeam] = useState([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/content/coaches`);
        setTeam(res.data);
      } catch (err) { console.error("Error fetching coaches:", err); }
    };
    fetchCoaches();
  }, [apiUrl]);

  if (team.length === 0) return null;

  return (
    <section className="py-28 px-6 bg-[#0f0f0f] text-white">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight">
            Meet Our <span className="text-amber-500">Elite Coaches</span>
          </h2>
          <p className="text-zinc-400 mt-4 text-sm md:text-base">
            Train with professionals who transform potential into performance
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {team.map((member) => (
            <div key={member._id} className="group text-center">
              {/* Image Card */}
              <div className="relative overflow-hidden rounded-3xl aspect-[4/5] border border-zinc-800">
                <img
                  src={member.imageBase64}
                  alt={member.name}
                  className="w-full h-full object-cover transition-all duration-700 scale-105 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-all duration-500" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-amber-500/20 via-transparent to-transparent transition-all duration-500" />
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-xs uppercase tracking-widest text-amber-500">
                    {member.role}
                  </p>
                </div>
              </div>

              {/* Info */}
              <div className="mt-5">
                <h3 className="text-lg font-bold uppercase tracking-wide">
                  {member.name}
                </h3>
                <p className="text-zinc-500 text-xs uppercase tracking-widest mt-2">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
