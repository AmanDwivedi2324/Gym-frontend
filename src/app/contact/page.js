"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import axios from "axios";
import toast from "react-hot-toast";
import { Send, Phone, Mail } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      await axios.post(`${apiUrl}/api/queries/send`, formData);
      toast.success("Message sent! We'll contact you soon.");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navbar */}
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pt-32 pb-24 grid md:grid-cols-2 gap-16 items-center">
        {/* LEFT SIDE */}
        <div className="space-y-8">
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase leading-tight">
            Get In <span className="text-yellow-500">Touch</span>
          </h1>

          <p className="text-zinc-400 text-lg max-w-md">
            Have questions about membership or training? Our team is ready to
            help you take the next step toward greatness.
          </p>

          {/* Contact Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#111111] rounded-xl flex items-center justify-center text-yellow-500 border border-zinc-800">
                <Phone size={18} />
              </div>
              <span className="font-medium text-zinc-300">+91 90000 00000</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#111111] rounded-xl flex items-center justify-center text-yellow-500 border border-zinc-800">
                <Mail size={18} />
              </div>
              <span className="font-medium text-zinc-300">
                support@titangym.com
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE (FORM) */}
        <div className="bg-[#111111] p-8 rounded-3xl border border-zinc-800">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              required
              className="w-full p-4 bg-[#0a0a0a] border border-zinc-700 rounded-xl outline-none focus:border-yellow-500"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="email"
                placeholder="Email"
                required
                className="w-full p-4 bg-[#0a0a0a] border border-zinc-700 rounded-xl outline-none focus:border-yellow-500"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Phone"
                className="w-full p-4 bg-[#0a0a0a] border border-zinc-700 rounded-xl outline-none focus:border-yellow-500"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <textarea
              rows="4"
              placeholder="How can we help?"
              className="w-full p-4 bg-[#0a0a0a] border border-zinc-700 rounded-xl outline-none focus:border-yellow-500"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
            />

            <button className="w-full bg-yellow-500 text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-yellow-400 transition">
              <Send size={18} /> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
