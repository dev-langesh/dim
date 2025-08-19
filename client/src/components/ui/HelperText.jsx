import { cn } from "@/utils/cn";
import React from "react";

function HelperTextComponent({ className, text, error, success }) {
  if (!text) return null;

  return (
    <p
      className={cn(
        "mt-1 text-sm text-on-muted",
        error && "text-destructive",
        success && "text-success",
        className
      )}
    >
      {text}
    </p>
  );
}

export const HelperText = React.memo(HelperTextComponent);
