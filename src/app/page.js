"use client";
import { useState, useEffect } from "react";
import axios from "axios";

// Components
import Navbar from "@/components/Navbar";
import Hero from "@/components/home/Hero";
import Welcome from "@/components/home/Welcome";
import Services from "@/components/home/Services";
import Staff from "@/components/home/Staff";
import GalleryPreview from "@/components/home/GalleryPreview";
import Stats from "@/components/home/Stats";
import Testimonials from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";
import MapFooter from "@/components/home/MapFooter";
import OfferPopup from "@/components/home/OfferPopup";
import Footer from "@/components/Footer";

export default function HomePage() {
  const [offer, setOffer] = useState(null);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/offers/active`,
        );
        if (res.data) setOffer(res.data);
      } catch (err) {
        console.log("No active offers");
      }
    };

    fetchOffer();
  }, []);

  return (
    <div className="bg-[#0a0a0a] text-white selection:bg-yellow-500/30 scroll-smooth">
      {/* Navbar */}
      {/* <Navbar /> */}

      {/* Sections */}
      <main className="space-y-24">
        <Hero />
        <Welcome />
        <Services />
        <Staff />
        <GalleryPreview />
        <Stats />
        <Testimonials />
        <FAQ />
      </main>

      {/* Footer Section */}
      <MapFooter />
      {/* <Footer /> */}

      {/* Offer Popup */}
      {offer && <OfferPopup offer={offer} />}
    </div>
  );
}
