import { ShieldCheck, Zap, Users, Trophy } from "lucide-react";

export default function Services() {
  const services = [
    {
      title: "Personal Training",
      desc: "Dedicated one-on-one coaching tailored to your body and goals.",
      icon: <Zap size={22} />,
    },
    {
      title: "Cardio Zone",
      desc: "High-end cardio equipment designed to push your endurance limits.",
      icon: <ShieldCheck size={22} />,
    },
    {
      title: "Group Classes",
      desc: "Train with a high-energy community that keeps you motivated.",
      icon: <Users size={22} />,
    },
    {
      title: "Nutrition Plans",
      desc: "Scientifically crafted diet plans for maximum performance.",
      icon: <Trophy size={22} />,
    },
  ];

  return (
    <section className="py-28 px-6 bg-[#0f0f0f] text-white">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="mb-16 max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight leading-tight">
            Premium <span className="text-amber-500">Services</span>
          </h2>
          <p className="text-zinc-400 mt-4 text-sm md:text-base">
            Everything you need to build strength, endurance, and confidence.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <div
              key={i}
              className="group relative p-6 rounded-2xl border border-zinc-800 bg-zinc-900 hover:border-yellow-500/40 transition-all duration-300"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-b from-amber-500/10 to-transparent rounded-2xl transition-all duration-300" />

              {/* Icon */}
              <div className="relative w-12 h-12 bg-amber-500 text-black rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition">
                {s.icon}
              </div>

              {/* Title */}
              <h3 className="relative text-lg font-bold uppercase tracking-wide mb-2">
                {s.title}
              </h3>

              {/* Description */}
              <p className="relative text-zinc-400 text-sm leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
