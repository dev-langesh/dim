import { cn } from "@/utils/cn";
import React from "react";

export default function Card({ children, className }) {
  return (
    <div
      className={cn("shadow-xl rounded-xl p-6 border border-border bg-card", className)}
    >
      {children}
    </div>
  );
}
