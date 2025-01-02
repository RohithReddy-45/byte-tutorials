import Link from "next/link";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

export default function Header() {
  return (
    <nav className="flex justify-between items-center max-w-7xl container mx-auto gap-10">
      <Logo />
      <div className="flex gap-4">
        <div className="space-x-4">
          <Link href="/sign-in">
            <Button>Sign in</Button>
          </Link>
        </div>
        <ModeToggle />
      </div>
    </nav>
  );
}
