'use client';
import { useState, useEffect } from "react";
import axios from "axios";
import { ArrowRight } from "lucide-react";

export default function GalleryPreview() {
  const [images, setImages] = useState([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/content/gallery`);
        // We only want a maximum of 6 images on the homepage preview.
        setImages(res.data.slice(0, 6)); 
      } catch (err) { console.error("Error fetching gallery:", err); }
    };
    fetchGallery();
  }, [apiUrl]);

  if (images.length === 0) return null;

  return (
    <section className="py-24 bg-[#0a0a0a] text-white overflow-hidden relative border-t border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
            Inside <span className="text-amber-500">The Arena</span>
          </h2>
          <p className="text-zinc-400 mt-4 max-w-xl text-lg">
            Immerse yourself in our state-of-the-art facility designed entirely for elite outcomes.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-1 md:gap-2 px-1 md:px-6 max-w-[1400px] mx-auto">
        {images.map((img) => (
          <div key={img._id} className="relative group overflow-hidden aspect-square bg-[#111]">
            <img
              src={img.imageBase64}
              alt={img.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <h3 className="text-white font-bold text-lg uppercase tracking-wide translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                {img.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
