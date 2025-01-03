import Image from "next/image";
import logoDark from "@/assets/logo-dark.png";
import logoLight from "@/assets/logo-light.png";
import { cn } from "@/lib/utils";

type LogoProps = {
  href?: string;
  className?: string;
};

export default function Logo({ href, className }: LogoProps) {
  return (
    <a href={href || "/"}>
      <Image
        src={logoDark}
        className={cn("w-48 min-w-40 hidden dark:block", className)}
        alt="byte tutorials logo"
      />
      <Image
        src={logoLight}
        className={cn("w-48 min-w-40 dark:hidden", className)}
        alt="byte tutorials logo"
      />
    </a>
  );
}
