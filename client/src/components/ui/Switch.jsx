"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";
import { Label } from "./Label";

// Track variants
const switchVariants = cva(
  "relative rounded-full outline-none cursor-pointer transition-colors data-[state=unchecked]:bg-zinc-400 data-[state=checked]:bg-primary",
  {
    variants: {
      size: {
        sm: "h-4 w-7", // track size: 16px tall, 28px wide
        md: "h-5 w-9", // track size: 20px tall, 36px wide
        lg: "h-6 w-11", // track size: 24px tall, 44px wide
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

// Thumb variants (auto-aligned based on size)
const thumbVariants = cva(
  "block rounded-full bg-white shadow transition-transform duration-150 will-change-transform",
  {
    variants: {
      size: {
        sm: "h-3 w-3 translate-x-[2px] data-[state=checked]:translate-x-[14px]",
        md: "h-4 w-4 translate-x-[2px] data-[state=checked]:translate-x-[18px]",
        lg: "h-5 w-5 translate-x-[2px] data-[state=checked]:translate-x-[22px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const Switch = React.forwardRef(({ className, size, label, ...props }, ref) => {
  return (
    <div className="flex items-center gap-2">
      {label && <Label htmlFor={props.id}>{label}</Label>}
      <SwitchPrimitive.Root
        ref={ref}
        id={props.id}
        className={cn(switchVariants({ size }), className)}
        {...props}
      >
        <SwitchPrimitive.Thumb className={cn(thumbVariants({ size }))} />
      </SwitchPrimitive.Root>
    </div>
  );
});

Switch.displayName = "Switch";

export default Switch;
