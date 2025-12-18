import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";

const NAVIGATIONS = [
  { label: "View Rooms", href: "/rooms/all" },
  { label: "My Rooms", href: "/rooms/mine" },
  { label: "Join Room", href: "/rooms/join" },
  { label: "Create Room", href: "/rooms/create" },
];

// footer section
export default function Footer() {
  return (
    <footer className="color-neutral color-neutral-content">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-7 py-7 sm:py-9 md:py-11">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Section */}
          <div className="flex flex-col justify-center items-start gap-3">
            {/* logo */}
            <Link href="/" className="flex rounded-sm overflow-hidden">
              <Image src="/logo.png" alt="Sketch Grid Logo" className="rounded-sm overflow-hidden" height={25} width={100} />
            </Link>
            <p className="text-sm">Building amazing web experiences with modern technology.</p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col justify-start items-center gap-4">
            <h4 className="font-semibold text-foreground">Navigations</h4>
            <nav className="flex flex-col justify-center items-center gap-2">
              {NAVIGATIONS.map((n, idx) => (
                <Link
                  key={idx}
                  href={n.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Company Links */}
          <div className="flex flex-col justify-start items-center gap-4">
            <h4 className="font-semibold text-foreground">Company</h4>
            <nav className="flex flex-col justify-center items-center gap-2">
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          {/* Legal Links */}
          <div className="flex flex-col justify-start items-center gap-4">
            <h4 className="font-semibold text-foreground">Socials</h4>
            <nav className="flex flex-col justify-center items-center gap-2">
              <Link href="https://github.com/AakrshitThakur" aria-label="GitHub" target="_blank">
                <FaGithub className="w-5 h-auto" />
              </Link>
              <Link href="https://www.linkedin.com/in/aakrshit-thakur-14433627b" aria-label="LinkedIn" target="_blank">
                <FaLinkedin className="w-5 h-auto" />
              </Link>
              <Link href="https://thakurraakrshitt@gmail.com" aria-label="Email" target="_blank">
                <IoMdMail className="w-5 h-auto" />
              </Link>
              <Link href="https://x.com/AakrshitThakur" aria-label="Twitter" target="_blank">
                <FaSquareXTwitter className="w-5 h-auto" />
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
