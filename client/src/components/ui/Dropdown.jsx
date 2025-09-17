"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@/utils/cn";
import React from "react";

export const Dropdown = DropdownMenu.Root;

Dropdown.Trigger = React.forwardRef(function DropdownTrigger(
  { className, children, ...props },
  ref
) {
  return (
    <DropdownMenu.Trigger
      ref={ref}
      className={cn("cursor-pointer outline-none select-none", className)}
      {...props}
    >
      {children}
    </DropdownMenu.Trigger>
  );
});

Dropdown.Content = React.forwardRef(function DropdownContent(
  { className, sideOffset = 8, children, ...props },
  ref
) {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          "w-52 rounded-md shadow-md bg-white p-2 text-sm z-50",
          className
        )}
        {...props}
      >
        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  );
});

Dropdown.Item = React.forwardRef(function DropdownItem(
  { className, children, ...props },
  ref
) {
  return (
    <DropdownMenu.Item
      ref={ref}
      className={cn(
        "flex items-center gap-2 px-3 py-2 cursor-pointer rounded-md hover:bg-zinc-100 outline-none",
        className
      )}
      {...props}
    >
      {children}
    </DropdownMenu.Item>
  );
});

Dropdown.Separator = React.forwardRef(function DropdownSeparator(
  { className, ...props },
  ref
) {
  return (
    <DropdownMenu.Separator
      ref={ref}
      className={cn("my-2 h-px bg-border", className)}
      {...props}
    />
  );
});
