"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

import { cn } from "@/lib/utils";

function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:bg-background-strong/50 z-50 min-w-[8rem] overflow-hidden rounded-md border border-neutral-200 bg-white/50 p-1 text-neutral-950 shadow-md backdrop-blur-md dark:border-neutral-800 dark:text-neutral-50",
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        // "data-[variant=destructive]:*:[svg]:!text-destructive-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-neutral-100 focus:text-neutral-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 data-[variant=destructive]:text-neutral-50 data-[variant=destructive]:focus:bg-red-500/10 data-[variant=destructive]:focus:text-neutral-50 dark:focus:bg-neutral-800 dark:focus:text-neutral-50 dark:data-[variant=destructive]:text-neutral-50 dark:dark:data-[variant=destructive]:focus:bg-red-900/40 dark:data-[variant=destructive]:focus:bg-red-500/40 dark:data-[variant=destructive]:focus:text-neutral-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-neutral-500 dark:[&_svg:not([class*='text-'])]:text-neutral-400",
        "data-[variant=destructive]:*:[svg]:!text-destructive-foreground dark:focus:bg-background-soft/50 relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden transition-all duration-300 select-none focus:bg-neutral-100 focus:text-neutral-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 data-[variant=destructive]:text-neutral-50 data-[variant=destructive]:focus:bg-red-500/10 data-[variant=destructive]:focus:text-neutral-50 dark:focus:text-neutral-50 dark:data-[variant=destructive]:text-neutral-50 dark:dark:data-[variant=destructive]:focus:bg-red-900/40 dark:data-[variant=destructive]:focus:bg-red-900/10 dark:data-[variant=destructive]:focus:text-neutral-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-neutral-500 dark:[&_svg:not([class*='text-'])]:text-neutral-400",
        className,
      )}
      {...props}
    />
  );
}

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem };
