'use client';
import { useState, useEffect } from "react";
import axios from "axios";

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/content/gallery`);
        setImages(res.data); 
      } catch (err) { console.error("Error fetching gallery:", err); }
    };
    fetchGallery();
  }, [apiUrl]);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-32 px-4 md:px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Heading Section */}
        <div className="mb-16 text-center md:text-left">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight">
            The <span className="text-amber-500">Sanctuary</span>
          </h2>
          <p className="text-zinc-500 mt-4 max-w-xl text-sm md:text-base mx-auto md:mx-0">
            Step inside the arena where strength is forged. Every corner is
            designed to push limits and build greatness.
          </p>
        </div>

        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[250px] md:auto-rows-[300px]">
          {images.map((img, i) => {
            // Give some dynamic sizing to the first element for style
            const isFeatured = i === 0;
            return (
              <div
                key={img._id}
                className={`relative overflow-hidden rounded-3xl group ${isFeatured ? 'md:col-span-2 md:row-span-2' : ''}`}
              >
                {/* Image */}
                <img
                  src={img.imageBase64}
                  alt={img.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

                {/* Content */}
                <div className="absolute bottom-0 p-6 translate-y-4 group-hover:translate-y-0 transition duration-500">
                  <p className="text-xs tracking-widest uppercase text-amber-500 font-bold mb-1">
                    XYZ GYM
                  </p>
                  <h3 className="text-lg font-bold opacity-0 group-hover:opacity-100 transition duration-500">
                    {img.title}
                  </h3>
                </div>

                {/* Glow Border Effect */}
                <div className="absolute inset-0 border border-white/5 rounded-3xl group-hover:border-amber-500/40 transition duration-500 pointer-events-none" />
              </div>
            );
          })}
        </div>

        {images.length === 0 && (
          <div className="text-center py-20 text-slate-500 border border-slate-800 rounded-3xl">
             No images uploaded yet.
          </div>
        )}
      </div>
    </main>
  );
}
