import type { Metadata } from "next";
import { Playwrite_AU_QLD } from "next/font/google";
import { ToastContainer } from "react-toastify";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import "./globals.css";

const playwrite_au_qld = Playwrite_AU_QLD({
  variable: "--playwrite-au-qld",
  weight: "200",
});

export const metadata: Metadata = {
  title: "SketchGrid - Collaborate Visually. Design Intuitively. Create Without Limits.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  description: "Collaborate Visually. Design Intuitively. Create Without Limits.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playwrite_au_qld.className}`}>
      <body className="color-base-100 color-base-content flex justify-center items-center p-1">
        <div id="app" className="max-w-7x">
          <ToastContainer />
          <Navbar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
