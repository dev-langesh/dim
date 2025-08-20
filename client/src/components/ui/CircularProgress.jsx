import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/cn";

const circularProgress = cva(
  "border-3 !border-t-transparent rounded-full animate-spin", // base styles
  {
    variants: {
      size: {
        sm: "w-6 h-6",
        md: "w-10 h-10",
        lg: "w-14 h-14",
      },
      color: {
        primary: "border-primary",
        secondary: "border-secondary",
        destructive: "border-destructive",
        success: "border-success",
      },
    },
    defaultVariants: {
      size: "md",
      color: "primary",
    },
  }
);

export function CircularProgress({ size, color, className, ...props }) {
  return (
    <div
      className={cn(circularProgress({ size, color }), className)}
      {...props}
    />
  );
}

export function FullPageLoading(className) {
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <CircularProgress />
    </div>
  );
}
