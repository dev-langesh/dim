"use client";

import React from "react";
import { cn } from "@/utils/cn";
import { cva } from "class-variance-authority";

const accountCircleVariants = cva(
  "flex items-center justify-center rounded-full overflow-hidden shrink-0",
  {
    variants: {
      size: {
        sm: "w-6 h-6 text-sm",
        md: "w-7 h-7 text-base",
        lg: "w-8 h-8 text-lg",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export default function AccountCircle({
  picture,
  caption,
  size = "md",
  className,
}) {
  const getInitial = () => {
    if (!caption) return "?";
    return caption.trim().charAt(0).toUpperCase();
  };

  if (picture) {
    return (
      <img
        src={picture}
        alt={caption || "Account"}
        className={cn(accountCircleVariants({ size }), className)}
      />
    );
  }

  return (
    <div
      className={cn(
        accountCircleVariants({ size }),
        "bg-primary text-white font-medium",
        className
      )}
    >
      {getInitial()}
    </div>
  );
}
