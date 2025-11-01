import type { Metadata, Viewport } from "next";
import { Playwrite_AU_QLD } from "next/font/google";
import { ToastContainer } from "react-toastify";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import "./globals.css";

const playwrite_au_qld = Playwrite_AU_QLD({
  variable: "--playwrite-au-qld",
  weight: "200",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

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
    <html lang="en" className={`${playwrite_au_qld.className} flex justify-center items-center`}>
      <body className="color-base-100 color-base-content max-w-7xl p-1">
        <div id="app" className="max-w-dvw">
          <ToastContainer />
          <Navbar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
