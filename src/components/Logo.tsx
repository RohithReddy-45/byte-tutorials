import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="font-original-surfer text-neutral-800 dark:text-white text-2xl"
    >
      byte tutorials
    </Link>
  );
}
