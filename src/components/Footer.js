"use client";
import Link from "next/link";
import { FaInstagram, FaYoutube, FaFacebook } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#0f0f0f] text-gray-400 px-6 md:px-16 py-14 border-t border-white/10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <h2 className="text-3xl font-black text-white">
            TITAN<span className="text-[#ff3c00]">GYM</span>
          </h2>
          <p className="mt-3 text-sm leading-6">
            Push your limits. Build your body. Transform your life.
          </p>

          <div className="flex gap-4 mt-5 text-xl">
            {[FaInstagram, FaYoutube, FaFacebook].map((Icon, i) => (
              <Icon
                key={i}
                className="cursor-pointer hover:text-[#ff3c00] transition hover:scale-110"
              />
            ))}
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {["Home", "Membership", "Gallery", "Careers"].map((item) => (
              <li key={item}>
                <Link
                  href="/"
                  className="hover:text-[#ff3c00] transition hover:pl-1"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Programs */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Programs</h3>
          <ul className="space-y-2">
            {["Weight Training", "Cardio", "Yoga", "Personal Training"].map(
              (item) => (
                <li key={item}>
                  <Link
                    href="/"
                    className="hover:text-[#ff3c00] transition hover:pl-1"
                  >
                    {item}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Contact</h3>
          <p className="text-sm">📍 Lucknow, India</p>
          <p className="text-sm">📞 +91 98765 43210</p>
          <p className="text-sm mb-4">✉️ titan@gym.com</p>

          {/* Newsletter */}
          <div className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-3 py-2 bg-[#1a1a1a] text-sm outline-none border border-white/10 rounded-l-md focus:border-[#ff3c00]"
            />
            <button className="bg-[#ff3c00] px-4 rounded-r-md text-white hover:bg-[#ff5a2a] transition shadow-[0_0_8px_#ff3c00]">
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10 mt-10 pt-5 text-center text-sm">
        © {new Date().getFullYear()} TITAN GYM. All Rights Reserved.
      </div>
    </footer>
  );
}
