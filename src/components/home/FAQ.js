"use client";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "Is there a trial period?",
    a: "Yes, we offer a 3-day elite pass for all new members.",
  },
  {
    q: "Do you provide personal training?",
    a: "Our Pro and Elite tiers include dedicated coaching sessions.",
  },
  {
    q: "What are the gym timings?",
    a: "We are open 24/7 for Elite members; 5AM - 11PM for others.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <section className="py-28 px-6 bg-[#0f0f0f] text-white">
      {/* Heading */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-zinc-400 mt-4 text-sm md:text-base">
          Everything you need to know before joining Titan Gym
        </p>
      </div>

      {/* FAQ Container */}
      <div className="max-w-3xl mx-auto space-y-5">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="border border-zinc-800 rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-950 hover:border-yellow-500/40 transition-all duration-300"
          >
            {/* Question */}
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full p-6 flex justify-between items-center text-left"
            >
              <span className="font-semibold text-sm md:text-base uppercase tracking-wide">
                {faq.q}
              </span>

              <span className="text-yellow-500">
                {open === i ? <Minus size={20} /> : <Plus size={20} />}
              </span>
            </button>

            {/* Answer */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                open === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <p className="px-6 pb-6 text-zinc-400 text-sm leading-relaxed">
                {faq.a}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
