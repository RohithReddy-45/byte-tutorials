import Image from "next/image";
import Link from "next/link";
import logoDark from "@/assets/logo-dark.png";
import logoWhite from "@/assets/logo-white.png";
import { cn } from "@/lib/utils";
import type { UrlObject } from "node:url";

type LogoProps = {
  href: string | UrlObject;
  className?: string;
};

export default function Logo({ href, className }: LogoProps) {
  const isUrlObject = (href: string | UrlObject): href is UrlObject => {
    return typeof href !== "string";
  };

  return (
    <Link href={isUrlObject(href) ? href : { pathname: href }}>
      <Image
        src={logoWhite}
        placeholder="blur"
        className={cn("w-36 hidden dark:block", className)}
        alt="devtube logo"
      />
      <Image
        src={logoDark}
        placeholder="blur"
        className={cn("w-36 dark:hidden", className)}
        alt="devtube logo"
      />
    </Link>
  );
}
