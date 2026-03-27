"use client";
import { useState } from "react";
import { X, Zap, ArrowRight, Gift } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

export default function OfferPopup({ offer }) {
  const [isOpen, setIsOpen] = useState(true);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !offer) return null;

  const handleClaim = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/queries/send", {
        name: "Offer Claimant",
        email: email,
        message: `User wants to claim: ${offer.heading} (Price: ${offer.price})`,
      });
      toast.success("Offer Claimed! We will contact you.");
      setIsOpen(false);
    } catch (err) {
      toast.error("Failed to claim. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      {/* Popup */}
      <div className="relative w-full max-w-lg rounded-[2.5rem] border border-zinc-800 bg-[#0f0f0f] overflow-hidden shadow-2xl">
        {/* Glow Accent */}
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-amber-500/20 blur-[100px] rounded-full" />

        <div className="relative p-8 md:p-10">
          {/* Close */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-5 right-5 text-zinc-500 hover:text-white transition cursor-pointer"
          >
            <X size={22} />
          </button>

          {/* Icon */}
          <div className="w-14 h-14 bg-amber-500 rounded-xl flex items-center justify-center text-black mb-6 shadow-lg">
            <Zap size={26} fill="currentColor" />
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-extrabold uppercase leading-tight mb-4">
            Limited Time <br />
            <span className="text-amber-500">Offer</span>
          </h2>

          {/* Offer Content */}
          <div className="mb-6">
            <h3 className="text-lg font-bold uppercase tracking-wide">
              {offer.heading}
            </h3>
            <p className="text-zinc-400 text-sm mt-2">{offer.description}</p>
          </div>

          {/* Price Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">
                Exclusive Price
              </p>
              <p className="text-3xl font-extrabold text-white">
                ₹{offer.price}
              </p>
            </div>
            <Gift className="text-amber-500 opacity-60" size={34} />
          </div>

          {/* Form */}
          <form onSubmit={handleClaim} className="space-y-3">
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3 bg-black border border-zinc-700 rounded-xl outline-none focus:border-amber-500 transition text-sm"
            />

            <button
              disabled={loading}
              className="cursor-pointer w-full bg-amber-500 hover:bg-amber-400 text-black py-3 rounded-xl font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Claim Offer"}
              {!loading && (
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              )}
            </button>
          </form>

          {/* Expiry */}
          <p className="mt-5 text-center text-[10px] text-zinc-500 uppercase tracking-widest">
            Offer valid till {new Date(offer.expiresAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
