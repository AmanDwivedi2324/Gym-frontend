import Navbar from "@/components/Navbar";
import { Briefcase, ArrowRight } from "lucide-react";

const jobs = [
  { title: "Senior Strength Coach", type: "Full-Time", pay: "₹40k - ₹70k" },
  { title: "Front Desk Executive", type: "Part-Time", pay: "₹15k - ₹25k" },
  { title: "Yoga Instructor", type: "Contract", pay: "Per Session" },
];

export default function CareerPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navbar */}
      {/* <Navbar /> */}

      <div className="pt-40 px-6 pb-20 max-w-5xl mx-auto">
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight mb-6">
          Build the <span className="text-yellow-500">Empire</span>
        </h1>

        {/* Subtext */}
        <p className="text-zinc-400 mb-16 text-lg max-w-xl">
          We are always looking for elite individuals who are obsessed with
          performance, discipline, and growth. Join our team and be part of
          something powerful.
        </p>

        {/* Jobs List */}
        <div className="space-y-6">
          {jobs.map((job, i) => (
            <div
              key={i}
              className="group relative p-8 rounded-3xl border border-zinc-800 bg-[#111111] hover:border-yellow-500/40 transition duration-500 cursor-pointer flex items-center justify-between"
            >
              {/* Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-yellow-500/10 blur-xl rounded-3xl transition duration-500" />

              {/* Left */}
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-[#0a0a0a] flex items-center justify-center text-yellow-500">
                  <Briefcase size={22} />
                </div>

                <div>
                  <h3 className="text-lg md:text-xl font-semibold uppercase tracking-tight">
                    {job.title}
                  </h3>

                  <p className="text-xs text-zinc-400 font-medium uppercase tracking-widest mt-1">
                    {job.type} • {job.pay}
                  </p>
                </div>
              </div>

              {/* Arrow */}
              <ArrowRight className="text-zinc-600 group-hover:text-yellow-500 transition-all group-hover:translate-x-2 relative z-10" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
