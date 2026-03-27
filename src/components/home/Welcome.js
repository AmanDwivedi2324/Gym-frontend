export default function Welcome() {
  return (
    <section className="py-28 bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

        {/* Image Side */}
        <div className="relative group">
          {/* Border Accent */}
          <div className="absolute -top-6 -left-6 w-32 h-32 border-t-2 border-l-2 border-yellow-500 opacity-70" />

          {/* Image */}
          <div className="overflow-hidden rounded-[2.5rem]">
            <img
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000"
              alt="Gym Vibe"
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition duration-700"
            />
          </div>

          {/* Glow Effect */}
          <div className="absolute inset-0 bg-yellow-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition duration-700 rounded-[2.5rem]" />
        </div>

        {/* Content Side */}
        <div className="space-y-8">

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-extrabold uppercase leading-tight tracking-tight">
            Welcome to the <br />
            <span className="text-yellow-500 text-5xl md:text-6xl">
              Empire
            </span>
          </h2>

          {/* Description */}
          <p className="text-zinc-400 leading-relaxed text-lg max-w-xl">
            Titan isn't just a gym — it's a high-performance arena built for dominance.
            Here, elite aesthetics meet raw strength. Every detail is engineered for those
            who refuse average and demand greatness.
          </p>

          {/* CTA */}
          <div className="pt-4">
            <button className="relative text-sm font-bold uppercase tracking-[0.25em] text-yellow-500 group">
              
              Discover More
              
              <span className="block h-[2px] w-0 bg-yellow-500 mt-2 group-hover:w-full transition-all duration-500"></span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}