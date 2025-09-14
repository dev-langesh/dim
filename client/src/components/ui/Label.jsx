"use client";

import * as React from "react";

import { cn } from "@/utils/cn";
import Tooltip from "./Tooltip";
import { FaCircleInfo } from "react-icons/fa6";

function LabelComponent({ className, children, info, ...props }) {
  return (
    <label
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      {info && (
        <Tooltip text={info}>
          <FaCircleInfo className="text-on-muted" />
        </Tooltip>
      )}
    </label>
  );
}

export const Label = React.memo(LabelComponent);
