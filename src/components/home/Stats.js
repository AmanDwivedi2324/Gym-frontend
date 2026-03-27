export default function Stats() {
  const data = [
    { label: "Active Members", val: "1200+" },
    { label: "Expert Trainers", val: "25+" },
    { label: "Premium Equipment", val: "150+" },
    { label: "Success Rate", val: "98%" },
  ];

  return (
    <section className="py-24 bg-[#0a0a0a] border-y border-zinc-800 text-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">

          {data.map((item, i) => (
            <div
              key={i}
              className="group relative"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-yellow-500/10 blur-xl transition duration-500 rounded-full" />

              {/* Value */}
              <h2 className="text-4xl md:text-5xl font-extrabold text-yellow-500 mb-2">
                {item.val}
              </h2>

              {/* Label */}
              <p className="text-[11px] md:text-xs font-semibold uppercase tracking-widest text-zinc-400">
                {item.label}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}