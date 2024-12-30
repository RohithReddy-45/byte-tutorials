import { FaInstagram, FaXTwitter } from "react-icons/fa6";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="mt-20 flex flex-col gap-2 p-10 leading-6 sm:px-20 text-center md:text-start">
      <div className="flex flex-col justify-between items-center gap-4 sm:items-start sm:flex-row">
        <div className="col-span-1 md:col-span-2">
          <Logo href="/" />
        </div>
        {/*NOTE: Add privacy and toc*/}
        <div className="space-x-4">
          <Link href="/" className="hover:text-blue-500">
            Privacy
          </Link>
          <Link href="/" className="hover:text-blue-500">
            Terms and Conditions
          </Link>
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center border-t border-gray-700 pt-8">
        <p>&copy; 2024 DevTube. All Rights Reserved</p>
        <div className="flex space-x-4">
          <a
            href="https://X.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition-all duration-300"
          >
            <span className="sr-only">X</span>
            <FaXTwitter size={24} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition-all duration-300"
          >
            <span className="sr-only">X</span>
            <FaInstagram size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
}
