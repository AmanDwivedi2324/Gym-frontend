"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const previewImages = [
  {
    url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    url: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1000",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    url: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1000",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    url: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=1000",
    span: "md:col-span-2 md:row-span-1",
  },
];

export default function GalleryPreview() {
  return (
    <section className="py-28 px-6 bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-14">
          <div>
            <h2 className="text-4xl md:text-6xl font-extrabold uppercase tracking-tight leading-none">
              The <span className="text-yellow-500">Sanctuary</span>
            </h2>
            <p className="text-zinc-500 mt-3 uppercase tracking-[0.25em] text-xs font-semibold">
              High Performance Training Zone
            </p>
          </div>

          <Link
            href="/gallery"
            className="hidden md:flex items-center gap-2 text-zinc-400 hover:text-yellow-500 transition-all group"
          >
            <span className="text-xs font-bold uppercase tracking-widest">
              View Full Gallery
            </span>
            <ArrowUpRight
              size={18}
              className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
            />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 auto-rows-[200px]">
          {previewImages.map((img, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-3xl border border-zinc-800 group ${img.span}`}
            >
              {/* Image */}
              <img
                src={img.url}
                alt="Gym Interior"
                className="w-full h-full object-cover transition-all duration-700 scale-105 group-hover:scale-125"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/20 transition-all duration-500" />

              {/* Glow Accent */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-yellow-500/20 via-transparent to-transparent transition-all duration-500" />

              {/* Optional Label */}
              <div className="absolute bottom-4 left-4 text-xs uppercase tracking-widest text-white/80 opacity-0 group-hover:opacity-100 transition">
                Elite Zone
              </div>
            </div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-10 md:hidden text-center">
          <Link
            href="/gallery"
            className="inline-block text-yellow-500 font-bold uppercase tracking-widest text-xs border border-yellow-500/40 px-6 py-3 rounded-full hover:bg-yellow-500 hover:text-black transition"
          >
            View Full Gallery →
          </Link>
        </div>
      </div>
    </section>
  );
}
