export default function Testimonials() {
  const testimonials = [
    {
      text: "The atmosphere at Titan is unmatched. It's the only place where aesthetics meet elite performance. Truly next-level.",
      name: "Arjun Mehta",
    },
    {
      text: "Finally a gym that respects the craft of bodybuilding. Everything—from lighting to community—is engineered for greatness.",
      name: "Rahul K.",
    },
  ];

  return (
    <section className="py-28 bg-[#0a0a0a] text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-center mb-20">
          What Our <span className="text-yellow-500">Warriors Say</span>
        </h2>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-10">
          {testimonials.map((item, i) => (
            <div
              key={i}
              className="relative group p-10 rounded-[2.5rem] border border-zinc-800 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-xl hover:border-yellow-500/40 transition duration-500"
            >
              {/* Quote Icon */}
              <div className="text-6xl text-yellow-500 opacity-20 absolute top-6 left-8">
                “
              </div>

              {/* Text */}
              <p className="text-zinc-300 leading-relaxed relative z-10">
                {item.text}
              </p>

              {/* Name */}
              <p className="mt-8 font-bold uppercase tracking-widest text-yellow-500 text-sm">
                — {item.name}
              </p>

              {/* Hover Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-yellow-500/10 blur-xl rounded-[2.5rem] transition duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
