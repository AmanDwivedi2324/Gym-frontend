import Navbar from "@/components/Navbar";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    price: "29",
    features: ["General Gym Access", "Locker Room", "Basic App Support"],
  },
  {
    name: "Pro",
    price: "59",
    features: [
      "All Starter Features",
      "Group Classes",
      "1x Personal Training",
      "Steam & Sauna",
    ],
    popular: true,
  },
  {
    name: "Elite",
    price: "99",
    features: [
      "All Pro Features",
      "Unlimited PT",
      "Nutrition Coaching",
      "24/7 VIP Access",
    ],
  },
];

export default function MembershipPage() {
  return (
    <main className="min-h-screen bg-[#09090b] text-white pt-40 pb-20 px-6 relative overflow-hidden">
      <Navbar />

      {/* 🔥 Background Glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/20 blur-[140px] rounded-full" />

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Heading */}
        <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase mb-4 leading-none">
          Choose your <span className="text-blue-600">Level</span>
        </h1>
        <p className="text-zinc-500 max-w-lg mx-auto mb-16">
          No long-term contracts. Just results. Upgrade your strength, unlock
          your potential.
        </p>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative p-10 rounded-[2.5rem] transition-all duration-500 group
              ${
                tier.popular
                  ? "bg-white/[0.03] border border-blue-500/40 scale-105 shadow-xl shadow-blue-600/10"
                  : "glass hover:bg-white/[0.03] border border-white/5 hover:border-blue-500/30"
              }`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-[10px] font-black uppercase px-4 py-1.5 rounded-full tracking-widest shadow-lg">
                  Most Popular
                </span>
              )}

              {/* Plan Name */}
              <h3 className="text-xl font-bold uppercase tracking-widest mb-3">
                {tier.name}
              </h3>

              {/* Price */}
              <div className="flex justify-center items-baseline gap-1 mb-8">
                <span className="text-5xl font-black italic">
                  ${tier.price}
                </span>
                <span className="text-zinc-500 text-sm">/mo</span>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-10 text-left">
                {tier.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-3 text-sm text-zinc-400"
                  >
                    <Check size={16} className="text-blue-500" /> {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-tighter text-sm transition-all
                ${
                  tier.popular
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30"
                    : "glass hover:bg-white/10"
                }`}
              >
                Select Plan
              </button>

              {/* Hover Glow */}
              <div className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition duration-500 bg-blue-600/5 blur-xl" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
