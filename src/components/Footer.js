"use client";
import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Dumbbell, MapPin, Phone, Mail, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  return (
    <footer className="bg-[#050505] text-white pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-amber-500/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16 relative z-10">
        
        {/* Brand Column */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <Link href="/" className="flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-[0_0_15px_#F59E0B]">
              <Dumbbell className="text-black" size={20} />
            </div>
            <span className="text-2xl font-black uppercase italic tracking-tight">
              XYZ
            </span>
          </Link>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">
            Forge your legacy in a facility designed for those who demand excellence. Elite equipment, expert coaching, unparalleled environment.
          </p>
          {/* Socials */}
          <div className="flex gap-4">
            <a href="https://instagram.com/xyzgym" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:bg-amber-500 hover:text-black transition-all">
              <Instagram size={18} />
            </a>
            <a href="https://twitter.com/xyzgym" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:bg-amber-500 hover:text-black transition-all">
              <Twitter size={18} />
            </a>
            <a href="https://youtube.com/@xyzgym" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:bg-amber-500 hover:text-black transition-all">
              <Youtube size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h4 className="text-lg font-bold uppercase tracking-widest mb-6">Explore</h4>
          <ul className="space-y-4">
            <li>
              <Link href={session ? "/membership" : "/login"} className="text-zinc-400 hover:text-amber-500 transition-colors text-sm font-medium">Join Now</Link>
            </li>
            <li>
              <a href="https://youtube.com/@xyzgym" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-amber-500 transition-colors text-sm font-medium flex items-center gap-2 justify-center md:justify-start">
                 Programs <Youtube size={14} className="text-amber-500"/>
              </a>
            </li>
            <li>
              <Link href="/gallery" className="text-zinc-400 hover:text-amber-500 transition-colors text-sm font-medium">Facility Tour</Link>
            </li>
            <li>
              <Link href="/contact" className="text-zinc-400 hover:text-amber-500 transition-colors text-sm font-medium">Contact Support</Link>
            </li>
          </ul>
        </div>

        {/* Connect */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h4 className="text-lg font-bold uppercase tracking-widest mb-6">Connect</h4>
          <ul className="space-y-4">
            <li className="flex items-start justify-center md:justify-start gap-3 text-zinc-400 text-sm">
              <MapPin className="text-amber-500 shrink-0 mt-0.5" size={18} />
              <span>
                123 Industrial Estate<br />
                Mumbai, MH 400001
              </span>
            </li>
            <li className="flex items-center justify-center md:justify-start gap-3 text-zinc-400 text-sm">
              <Phone className="text-amber-500 shrink-0" size={18} />
              <span>+91 XXXXX XX999</span>
            </li>
            <li className="flex items-center justify-center md:justify-start gap-3 text-zinc-400 text-sm">
              <Mail className="text-amber-500 shrink-0" size={18} />
              <span>xyz@gmail.com</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h4 className="text-lg font-bold uppercase tracking-widest mb-6">Stay Updated</h4>
          <p className="text-zinc-400 text-sm mb-4">
            Subscribe for elite training tips and exclusive membership drops.
          </p>
          <form className="w-full flex" onSubmit={(e) => { e.preventDefault(); toast.success('Subscribed!'); setEmail(''); }}>
            <input 
              type="email" 
              placeholder="YOUR EMAIL" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black border border-zinc-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-amber-500 w-full rounded-l-lg"
            />
            <button 
              type="submit"
              className="cursor-pointer bg-amber-500 hover:bg-amber-400 text-black px-6 py-3 font-bold text-sm tracking-wider uppercase transition-colors rounded-r-lg"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-600 font-medium">
        <p>© {new Date().getFullYear()} XYZ GYM. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
