"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Dumbbell, User, Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Plans", path: "/membership" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ];

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="fixed top-4 md:top-6 w-full z-[100] px-4">
        <nav className="max-w-6xl mx-auto bg-[#0f0f0f]/80 backdrop-blur-lg border border-white/10 rounded-full px-4 md:px-6 py-3 flex items-center justify-between shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group z-50">
            <div className="w-8 h-8 md:w-9 md:h-9 bg-amber-500 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-[0_0_10px_#F59E0B]">
              <Dumbbell className="text-black" size={18} />
            </div>
            <span className="text-base md:text-lg font-black uppercase italic text-white tracking-tight">
              XYZ
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`relative text-[13px] font-bold uppercase tracking-widest transition ${
                  pathname === link.path
                    ? "text-amber-500"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {link.name}

                {/* Active underline */}
                {pathname === link.path && (
                  <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-amber-500 shadow-[0_0_8px_#F59E0B]" />
                )}
              </Link>
            ))}
          </div>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-4 z-50">
            <Link
              href="/login"
              className="hidden md:flex items-center gap-2 bg-amber-500 px-5 py-2 rounded-full text-[12px] font-bold uppercase tracking-wide text-black hover:bg-amber-400 transition-all active:scale-95 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
            >
              <User size={14} className="text-black" />
              Join Now
            </Link>
            
            <button 
              className="md:hidden text-white p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
         <div className="fixed inset-0 z-[90] bg-[#0a0a0a]/95 backdrop-blur-xl flex flex-col items-center justify-center px-4">
            <div className="flex flex-col items-center gap-8 w-full">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`text-2xl font-black uppercase tracking-widest ${
                    pathname === link.path ? "text-amber-500" : "text-white"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              <Link
                href="/login"
                className="mt-8 flex items-center justify-center gap-2 bg-amber-500 w-full max-w-xs py-4 rounded-full text-lg font-black uppercase tracking-wide text-black transition-all active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
              >
                <User size={20} className="text-black" />
                Member Login
              </Link>
            </div>
         </div>
      )}
    </>
  );
}
