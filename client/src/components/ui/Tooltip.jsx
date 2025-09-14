"use client";

import { cn } from "@/utils/cn";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { memo } from "react";

function Tooltip({
  children,
  text,
  side = "bottom",
  align = "center",
  className,
  delay = 100,
}) {
  return (
    <TooltipPrimitive.Provider delayDuration={delay}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            align={align}
            className={cn(
              "rounded bg-black px-2 py-1 text-xs text-white shadow-md max-w-[200px] ",
              className
            )}
          >
            {text}
            <TooltipPrimitive.Arrow />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

export default memo(Tooltip);
