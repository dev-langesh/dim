import { cn } from "@/utils/cn";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import React from "react";

export default function Separator({ orientation = "horizontal", className }) {
  return (
    <SeparatorPrimitive.Root
      orientation={orientation}
      className={cn("bg-zinc-300 w-[1px] h-[1px] flex-shrink-0", orientation === "vertical" ? "h-full" : "w-full", className)}
    />
  );
}
