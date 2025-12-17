import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";

// footer section
export default function Footer() {
  return (
    <footer className="color-neutral color-neutral-content">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-7 py-7 sm:py-9 md:py-11">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Section */}
          <div className="flex flex-col gap-3">
            {/* logo */}
            <Link href="/" className="flex rounded-sm overflow-hidden">
              <Image src="/logo.png" alt="Sketch Grid Logo" className="rounded-sm overflow-hidden" height={25} width={100} />
            </Link>
            <p className="text-sm">Building amazing web experiences with modern technology.</p>
            {/* Social Links */}
            <div className="flex gap-3">
              <Link href="#" aria-label="GitHub" className="text-muted-foreground hover:text-foreground transition-colors">
                <FaGithub className="w-5 h-auto" />
              </Link>
              <Link href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-foreground transition-colors">
                <FaLinkedin className="w-5 h-auto" />
              </Link>
              <Link href="#" aria-label="Email" className="text-muted-foreground hover:text-foreground transition-colors">
                <IoMdMail className="w-5 h-auto" />
              </Link>
              <Link href="#" aria-label="Twitter" className="text-muted-foreground hover:text-foreground transition-colors">
                <FaSquareXTwitter className="w-5 h-auto" />
              </Link>
            </div>
          </div>

          {/* Product Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-foreground">Product</h4>
            <nav className="flex flex-col gap-2">
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Security
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Roadmap
              </Link>
            </nav>
          </div>

          {/* Company Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-foreground">Company</h4>
            <nav className="flex flex-col gap-2">
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Blog
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Careers
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          {/* Legal Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-foreground">Legal</h4>
            <nav className="flex flex-col gap-2">
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Cookies
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                License
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
