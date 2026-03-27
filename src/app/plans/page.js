"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import axios from "axios";
import { Check } from "lucide-react";
import API from "../../../lib/api";
// import API from "@/lib/api";

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await API.get("/plans/all");
        setPlans(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return (
    <main className="min-h-screen bg-[#09090b] text-white pt-40 pb-20 px-6 relative overflow-hidden">
      <Navbar />

      {/* 🔥 Background Glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/20 blur-[140px] rounded-full" />

      <div className="max-w-7xl mx-auto text-center relative z-10">
        {/* Heading */}
        <h2 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase mb-4">
          Choose Your <span className="text-blue-600">Plan</span>
        </h2>
        <p className="text-zinc-500 mb-16">
          Simple pricing for elite performance.
        </p>

        {/* Loading State */}
        {loading ? (
          <p className="text-zinc-500">Loading plans...</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan._id}
                className={`relative p-10 rounded-[2.5rem] transition-all duration-500 group
                ${
                  plan.isBestValue
                    ? "bg-white/[0.03] border border-blue-500/40 scale-105 shadow-xl shadow-blue-600/10"
                    : "glass border border-white/5 hover:border-blue-500/30 hover:bg-white/[0.03]"
                }`}
              >
                {/* Best Value Badge */}
                {plan.isBestValue && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                    Best Value
                  </span>
                )}

                {/* Plan Name */}
                <h3 className="text-xl font-bold uppercase tracking-widest mb-3">
                  {plan.planName}
                </h3>

                {/* Price */}
                <p className="text-5xl font-black italic mb-8">
                  ${plan.price}
                  <span className="text-sm text-zinc-500">/mo</span>
                </p>

                {/* Features */}
                <ul className="text-left space-y-4 mb-10">
                  {plan.features.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-zinc-400 text-sm"
                    >
                      <Check size={16} className="text-blue-500" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  className={`w-full py-4 rounded-2xl font-black uppercase tracking-tighter text-sm transition-all
                  ${
                    plan.isBestValue
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30"
                      : "glass hover:bg-white/10"
                  }`}
                >
                  Join Titan
                </button>

                {/* Hover Glow */}
                <div className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition duration-500 bg-blue-600/5 blur-xl" />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
