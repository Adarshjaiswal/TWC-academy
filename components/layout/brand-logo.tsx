import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ className, priority = false }: BrandLogoProps) {
  return (
    <span className={cn("relative block h-12 w-36 shrink-0 overflow-hidden", className)}>
      <Image
        alt="Trade Wave Capital"
        className="h-full w-full object-contain"
        height={240}
        priority={priority}
        src="/brand/trade-wave-capital-logo-transparent.png"
        width={485}
      />
    </span>
  );
}
