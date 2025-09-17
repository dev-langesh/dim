"use client";

import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { IoIosArrowDown } from "react-icons/io";
import { cn } from "@/utils/cn";

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <CollapsiblePrimitive.Trigger
      ref={ref}
      className={cn(
        "flex w-full items-center justify-between rounded-[6px] border border-border px-3 py-2 text-sm md:text-base font-medium",
        "bg-white shadow-xs outline-none transition-colors",
        "hover:border-border-active cursor-pointer text-primary",
        className
      )}
      {...props}
    >
      {children}
      <IoIosArrowDown
        className="ml-2 size-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    </CollapsiblePrimitive.Trigger>
  )
);
CollapsibleTrigger.displayName = "CollapsibleTrigger";

const CollapsibleContent = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <CollapsiblePrimitive.Content
      ref={ref}
      className={cn(
        "overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down",
        className
      )}
      {...props}
    >
      <div className="rounded-[6px] border border-border mt-2 p-3 shadow-xs bg-white">
        {children}
      </div>
    </CollapsiblePrimitive.Content>
  )
);
CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
