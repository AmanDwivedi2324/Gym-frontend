'use client';
import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  
  // List of routes where the public Navbar/Footer should be completely hidden
  const isIsolatedRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/login') || pathname?.startsWith('/register');

  return (
    <>
      {!isIsolatedRoute && <Navbar />}
      
      {/* Admin handles its own layout styling. Pages needing top padding must apply it themselves. */}
      <main className="min-h-screen">
        {children}
      </main>

      {!isIsolatedRoute && <Footer />}
    </>
  );
}
