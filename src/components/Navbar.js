"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, User } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Membership", path: "/membership" },
    { name: "Gallery", path: "/gallery" },
    { name: "Careers", path: "/career" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <div className="fixed top-6 w-full z-[100] px-4">
      <nav className="max-w-6xl mx-auto bg-[#0f0f0f]/80 backdrop-blur-lg border border-white/10 rounded-full px-6 py-3 flex items-center justify-between shadow-[0_0_30px_rgba(0,0,0,0.8)]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-[#ff3c00] rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-[0_0_10px_#ff3c00]">
            <Dumbbell className="text-white" size={20} />
          </div>
          <span className="text-lg font-black uppercase italic text-white tracking-tight">
            TITAN
          </span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`relative text-[13px] font-bold uppercase tracking-widest transition ${
                pathname === link.path
                  ? "text-[#ff3c00]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {link.name}

              {/* Active underline */}
              {pathname === link.path && (
                <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-[#ff3c00] shadow-[0_0_8px_#ff3c00]" />
              )}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/login"
          className="flex items-center gap-2 bg-[#ff3c00] px-5 py-2 rounded-full text-[12px] font-bold uppercase tracking-wide text-white hover:bg-[#ff5a2a] transition-all active:scale-95 shadow-[0_0_10px_#ff3c00]"
        >
          <User size={14} />
          Join Now
        </Link>
      </nav>
    </div>
  );
}
