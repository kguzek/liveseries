import { cn } from "@/lib/utils";

export function Logo({ size = 80, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("max-w-16 min-w-5 sm:max-w-none", className)}
    >
      {/* TV body */}
      <rect
        x="6"
        y="12"
        width="68"
        height="48"
        rx="6"
        stroke="#2596be"
        strokeWidth="3"
        fill="#262322"
      />
      {/* Screen */}
      <rect x="14" y="20" width="52" height="32" rx="2" fill="#2596be" />
      {/* LS text */}
      <text
        x="40"
        y="41"
        textAnchor="middle"
        fill="#262322"
        fontSize="20"
        fontFamily="sans-serif"
        fontWeight="bold"
      >
        LS
      </text>
      {/* Antenna */}
      <line
        x1="40"
        y1="12"
        x2="40"
        y2="4"
        stroke="#2596be"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Antenna tip */}
      <circle cx="40" cy="3" r="3" fill="#2596be" />
      {/* Left leg */}
      <line
        x1="20"
        y1="60"
        x2="12"
        y2="74"
        stroke="#2596be"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Right leg */}
      <line
        x1="60"
        y1="60"
        x2="68"
        y2="74"
        stroke="#2596be"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Power light */}
      <circle cx="70" cy="10" r="2" fill="#3dc983" />
    </svg>
  );
}
