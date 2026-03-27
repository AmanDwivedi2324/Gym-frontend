"use client";
import { useState, useEffect } from "react";

const images = [
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070",
  "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070",
  "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2070",
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Background Slider */}
      {images.map((img, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-all duration-1000 ${
            i === index ? "opacity-100 scale-100" : "opacity-0 scale-110"
          }`}
          style={{
            backgroundImage: `url(${img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ))}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Gradient Depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        {/* Tagline */}
        <p className="text-yellow-500 uppercase tracking-[0.4em] text-xs mb-4">
          Elite Fitness Club
        </p>

        {/* Heading */}
        <h1 className="text-5xl md:text-8xl font-extrabold uppercase leading-[0.9] tracking-tight mb-6">
          Build Your <br />
          <span className="text-yellow-500">Titan Physique</span>
        </h1>

        {/* Subtext */}
        <p className="text-zinc-400 text-sm md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Transform your body with world-class equipment, expert coaching, and a
          high-performance environment designed for serious athletes.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <button className="bg-yellow-500 text-black px-10 py-4 rounded-full font-bold uppercase tracking-wide hover:bg-yellow-400 transition-all duration-300">
            Join Now
          </button>

          <button className="border border-zinc-600 text-white px-10 py-4 rounded-full font-bold uppercase tracking-wide hover:border-yellow-500 hover:text-yellow-500 transition-all duration-300">
            Explore Plans
          </button>
        </div>
      </div>

      {/* Bottom Fade (for smooth transition to next section) */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0f0f0f] to-transparent" />
    </section>
  );
}
