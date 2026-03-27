import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import SessionWrapper from "@/components/SessionWrapper";
import LayoutWrapper from "@/components/LayoutWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Titan Gym | Elite Fitness Management",
  description: "Manage your fitness journey and membership easily.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0f0f0f] text-white`}>
        <SessionWrapper>
          <Toaster position="top-center" />
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </SessionWrapper>
      </body>
    </html>
  );
}
