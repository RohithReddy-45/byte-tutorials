import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-border/50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          {/* Logo + copyright */}
          <div className="flex flex-col items-center sm:items-start gap-2">
            <Logo />
            <p className="text-xs text-muted-foreground/60">
              © {new Date().getFullYear()} Byte Tutorials. Built by{" "}
              <a
                href="https://github.com/RohithReddy-45"
                className="hover:text-foreground transition-colors"
              >
                Rohith Reddy
              </a>
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms-and-conditions"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </Link>

            {/* Socials */}
            <div className="flex items-center gap-3 ml-2">
              <a
                href="https://X.com/Ro_dev45"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <FaXTwitter size={18} />
              </a>
              <a
                href="https://github.com/RohithReddy-45"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <FaGithub size={18} />
              </a>
              <a
                href="https://linkedin.com/in/RohithReddy-45"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <FaLinkedin size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
