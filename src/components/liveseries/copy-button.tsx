"use client";

import { Glow } from "@codaworks/react-glow";
import { Copy } from "lucide-react";

export function CopyButton({ value }: { value: string }) {
  return (
    <Glow color="var(--color-accent)">
      <button
        onClick={async () => {
          await navigator.clipboard.writeText(value);
        }}
        className="clickable glow:text-accent flex items-center justify-center transition-colors duration-300"
        title="Copy to clipboard"
      >
        <Copy className="size-4" />
      </button>
    </Glow>
  );
}
