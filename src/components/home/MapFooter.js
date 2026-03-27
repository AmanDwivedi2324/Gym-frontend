import Link from "next/link";
import { useSession } from "next-auth/react";

export default function MapFooter() {
  const { data: session } = useSession();
  return (
    <section className="bg-[#0f0f0f] text-white pt-24">
      {/* Heading */}
      <div className="max-w-6xl mx-auto px-6 mb-12 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight">
          Visit Our <span className="text-amber-500">Facility</span>
        </h2>
        <p className="text-zinc-400 mt-4 text-sm md:text-base">
          Experience the environment where transformation begins
        </p>
      </div>

      {/* Map */}
      <div className="relative w-full h-[400px]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18..."
          className="w-full h-full border-none grayscale brightness-75 contrast-125"
          loading="lazy"
        ></iframe>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      </div>

      {/* Info Cards */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-6">
        {/* Address */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-amber-500/40 transition">
          <h3 className="text-sm uppercase tracking-widest text-amber-500 mb-3">
            Location
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Titan Gym, Gomti Nagar <br />
            Lucknow, Uttar Pradesh <br />
            India
          </p>
        </div>

        {/* Timings */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-amber-500/40 transition">
          <h3 className="text-sm uppercase tracking-widest text-amber-500 mb-3">
            Working Hours
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Mon - Sat: 5AM - 11PM <br />
            Sunday: 7AM - 9PM <br />
            Elite Members: 24/7 Access
          </p>
        </div>

        {/* CTA */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between hover:border-amber-500/40 transition">
          <div>
            <h3 className="text-sm uppercase tracking-widest text-amber-500 mb-3">
              Get Started
            </h3>
            <p className="text-zinc-400 text-sm mb-4">
              Start your fitness journey with us today.
            </p>
          </div>

          <Link href={session ? "/membership" : "/login"} className="cursor-pointer text-center mt-4 bg-amber-500 text-black py-3 rounded-full font-bold uppercase tracking-wide hover:bg-amber-400 transition">
            {session ? "View Titan Plans" : "Join Now"}
          </Link>
        </div>
      </div>
    </section>
  );
}
