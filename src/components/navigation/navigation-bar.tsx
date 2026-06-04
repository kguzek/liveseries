"use client";

import type { ComponentProps } from "react";
import AbsoluteLink from "next/link";
import { useRef } from "react";
import { Search, TrendingUp } from "lucide-react";

import type { MenuItem } from "@/lib/types";
import type { User } from "@/payload-types";
import { AppLink } from "@/components/link/app-link";
import { Link, usePathname } from "@/i18n/navigation";
import { useScroll } from "@/lib/hooks/scroll";
import { cn } from "@/lib/utils";

import { Logo } from "../image/logo";
import { LanguageSelector } from "./language-selector";
import { UserWidget } from "./user-widget";

const ICONS_BY_URL: Record<string, typeof TrendingUp | undefined> = {
  "/most-popular": TrendingUp,
  "/search": Search,
};

function NavBarItem({
  item,
  ...props
}: { item: MenuItem } & Omit<
  ComponentProps<typeof AppLink>,
  "href" | "icon" | "children"
>) {
  const pathname = usePathname();
  const Icon = ICONS_BY_URL[item.url];

  if (!Icon) {
    const Comp = item.isAbsolute ? AbsoluteLink : Link;
    const isActive = item.url === "/" ? pathname === "/" : pathname?.startsWith(item.url);
    return (
      <Comp
        {...props}
        href={item.url}
        className={cn("text-primary flex items-center gap-2", {
          "text-primary-strong": isActive,
        })}
      >
        <span
          className={cn("hover-underline", {
            "underlined text-primary-strong": isActive,
          })}
        >
          {item.label || item.title}
        </span>
      </Comp>
    );
  }

  const isActive = item.url === "/" ? pathname === "/" : pathname?.startsWith(item.url);

  return (
    <AppLink {...props} href={item.url} icon={Icon} active={isActive}>
      {item.label || item.title}
    </AppLink>
  );
}

export function NavigationBar({
  user,
  menuItems,
}: {
  user: User | null;
  menuItems: MenuItem[];
}) {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const hamburgerRef = useRef<HTMLInputElement>(null);

  function closeMenu() {
    if (hamburgerRef.current == null) {
      return;
    }
    hamburgerRef.current.checked = false;
  }

  const userWidget = <UserWidget user={user} closeMenu={closeMenu} />;

  return (
    <nav
      className={cn(
        "fixed top-0 z-10 flex h-(--navbar-height) w-screen items-center gap-4 border-0 border-b border-solid border-transparent bg-transparent px-4 [transition:all_300ms_ease,border-color_1s_ease] sm:px-[40px] lg:gap-6",
        "noscript:border-background-soft noscript:bg-background-strong/70 noscript:backdrop-blur-2xl",
        {
          "border-background-soft bg-background-strong/70 backdrop-blur-2xl": scrollY > 0,
        },
      )}
    >
      <Link
        href="/"
        aria-label="LiveSeries Home"
        className="group flex items-center gap-2"
      >
        <Logo
          size={80}
          className="transition-transform duration-300 group-hover:scale-110"
        />
        <span
          className={cn("hover-underline font-bold whitespace-nowrap sm:text-3xl", {
            "underlined!": pathname === "/",
          })}
        >
          LiveSeries
        </span>
      </Link>
      <div className="ml-auto flex flex-row-reverse self-stretch lg:flex-row">
        {/* Hamburger */}
        <label
          aria-controls="menu"
          className="peer z-30 flex cursor-pointer flex-col justify-center p-4 lg:hidden"
        >
          <input
            type="checkbox"
            id="hamburger"
            className="peer hidden"
            ref={hamburgerRef}
            aria-controls="menu"
            aria-expanded="false"
            onChange={(event_) => {
              const isChecked = event_.target.checked;
              event_.target.setAttribute("aria-expanded", isChecked.toString());
              document.body.style.overflow = isChecked ? "hidden" : "";
            }}
          />
          <div className="bg-primary mb-1.5 w-6 transform rounded-full pt-0.5 transition-transform duration-300 peer-checked:translate-y-2 peer-checked:-rotate-45"></div>
          <div className="bg-primary mb-1.5 w-6 rounded-full pt-0.5 opacity-100 transition-opacity peer-checked:opacity-0"></div>
          <div className="bg-primary w-6 transform rounded-full pt-0.5 transition-transform duration-300 peer-checked:-translate-y-2 peer-checked:rotate-45"></div>
        </label>
        {/* Click outside menu to hide */}
        <label
          htmlFor="hamburger"
          aria-controls="menu"
          className="bg-background-strong/25 pointer-events-none fixed top-0 left-0 z-10 h-screen w-screen opacity-0 backdrop-blur-sm transition-opacity duration-300 peer-has-checked:pointer-events-auto peer-has-checked:opacity-100 lg:hidden"
        ></label>
        {/* Menu */}
        <ul
          id="menu"
          role="menubar"
          aria-label="navigation menu"
          className="border-background-soft bg-gradient-main/50 shadow-background-strong invisible absolute top-0 right-0 z-20 w-full origin-top translate-y-[-100%] items-center gap-6 rounded-b-lg border-0 border-b py-4 opacity-0 shadow-lg backdrop-blur-2xl transition-all duration-300 select-none peer-has-checked:visible peer-has-checked:translate-y-0 peer-has-checked:scale-100 peer-has-checked:opacity-100 sm:top-3 sm:right-10 sm:w-[50%] sm:origin-top-right sm:translate-y-0 sm:scale-[25%] sm:rounded-lg sm:border sm:border-solid lg:visible lg:static lg:flex lg:w-full lg:scale-100 lg:transform-none lg:border-none lg:bg-transparent lg:pt-0 lg:pb-0 lg:opacity-100 lg:shadow-none lg:backdrop-blur-none"
        >
          {menuItems.map((item) => (
            <li
              className="flex justify-center px-4 py-3 lg:py-0"
              key={`nav-link-${item.id}`}
            >
              <NavBarItem onClick={closeMenu} item={item} />
            </li>
          ))}
          <div className="flex justify-center pt-2 pb-1 sm:hidden">{userWidget}</div>
          <LanguageSelector />
        </ul>
        <div className="mx-3 hidden sm:block">{userWidget}</div>
      </div>
    </nav>
  );
}
