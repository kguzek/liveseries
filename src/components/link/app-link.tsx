import type { LucideIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function AppLink({
  href,
  icon: Icon,
  children,
  className,
  active,
  ...props
}: {
  href: string;
  icon: LucideIcon;
  children: ReactNode;
  className?: string;
  active?: boolean;
} & Omit<ComponentProps<typeof Link>, "href" | "children" | "className">) {
  return (
    <Link
      href={href}
      className={cn(
        "text-primary flex items-center gap-2",
        active && "text-primary-strong",
        className,
      )}
      {...props}
    >
      {Icon && <Icon className="size-4" />}
      <span className={cn("hover-underline", active && "underlined text-primary-strong")}>
        {children}
      </span>
    </Link>
  );
}
