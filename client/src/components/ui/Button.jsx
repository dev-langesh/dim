import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[6px] text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none cursor-pointer shadow-xs select-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-on-primary hover:bg-primary/90",
        outline: "border bg-on-primary border-primary text-primary hover:bg-primary/5",
        destructive: "bg-destructive text-on-destructive hover:bg-destructive/90",
        destructiveOutline: "border bg-on-primary border-destructive text-destructive hover:bg-destructive/5",
        success: "bg-success text-on-success hover:bg-success/90",
        successOutline: "border bg-on-primary border-success text-success hover:bg-success/5",
        secondary: "bg-secondary text-on-secondary hover:bg-secondary/90",
        secondaryOutline: "border bg-on-primary border-secondary text-secondary hover:bg-secondary/5",
      },
      size: {
        default: "h-9 px-4 py-2",
        xs: "h-6 gap-1.5 px-2 rounded-sm",
        sm: "h-7 gap-1.5 px-3 rounded-sm",
        lg: "h-10 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({ className, variant, size, icon, children, ...props }) {
  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {icon && React.isValidElement(icon)
        ? React.cloneElement(icon, {
            className: cn("text-md", icon.props.className),
          })
        : icon}
      {children}
    </button>
  );
}

export default React.memo(Button);
