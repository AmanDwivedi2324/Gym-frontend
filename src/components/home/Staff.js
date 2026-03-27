const team = [
  {
    name: "Vikram Singh",
    role: "Founder / Head Coach",
    img: "https://images.unsplash.com/photo-1567013127542-490d757e51fe?q=80&w=800",
  },
  {
    name: "Sarah Jones",
    role: "Strength Specialist",
    img: "https://images.unsplash.com/photo-1548690312-e3b507d17a4d?q=80&w=800",
  },
  {
    name: "Marcus Vane",
    role: "Nutrition Expert",
    img: "https://images.unsplash.com/photo-1507398941214-57f5162123bf?q=80&w=800",
  },
];

export default function Staff() {
  return (
    <section className="py-28 px-6 bg-[#0f0f0f] text-white">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight">
            Meet Our <span className="text-yellow-500">Elite Coaches</span>
          </h2>
          <p className="text-zinc-400 mt-4 text-sm md:text-base">
            Train with professionals who transform potential into performance
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {team.map((member, i) => (
            <div key={i} className="group text-center">
              {/* Image Card */}
              <div className="relative overflow-hidden rounded-3xl aspect-[4/5] border border-zinc-800">
                {/* Image */}
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-full object-cover transition-all duration-700 scale-105 group-hover:scale-110"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-all duration-500" />

                {/* Gradient Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-yellow-500/20 via-transparent to-transparent transition-all duration-500" />

                {/* Role Overlay */}
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-xs uppercase tracking-widest text-yellow-500">
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
