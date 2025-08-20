// components/ui/select.tsx
"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "@/utils/cn";
import { Label } from "./Label";

// Root
function Select(props) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

// Trigger
function SelectTrigger({ className, placeholder, children, ...props }) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        "flex gap-2 items-center justify-between w-full h-9 rounded-[6px] border bg-transparent px-3 py-2 text-sm md:text-base shadow-xs outline-none transition-colors hover:border-border-active border-border",
        "disabled:cursor-not-allowed disabled:bg-disabled disabled:border-none disabled:shadow-none",
        "data-[placeholder]:text-muted-foreground cursor-pointer",
        className
      )}
      {...props}
    >
      <SelectPrimitive.Value
        placeholder={placeholder}
        className="data-[placeholder]:text-muted-foreground"
      >
        {children}
      </SelectPrimitive.Value>
      <SelectPrimitive.Icon>
        <ArrowDownIcon className="data-[placeholder]:text-muted-foreground" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

// Content
function SelectContent({ className, sideOffset = 8, ...props }) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        position="popper"
        sideOffset={sideOffset}
        style={{ minWidth: "var(--radix-select-trigger-width)" }}
        className={cn(
          "rounded-[6px] border border-input bg-white shadow-xs focus:outline-none",
          className
        )}
        {...props}
      >
        <SelectPrimitive.Viewport className="space-y-2 py-2">
          {props.children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

// Item
function SelectItem({ className, children, ...props }) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "cursor-pointer select-none px-3 rounded-md text-sm md:text-base text-muted-foreground",
        "data-[state=checked]:font-semibold data-[state=checked]:text-black outline-none",
        className
      )}
      {...props}
    >
      {children}
    </SelectPrimitive.Item>
  );
}

// Item Text
function SelectItemText({ className, children }) {
  return (
    <SelectPrimitive.ItemText
      data-slot="select-item-text"
      className={cn(className)}
    >
      {children}
    </SelectPrimitive.ItemText>
  );
}

function SelectInputComponent({
  value,
  onChange,
  label,
  helperText,
  options = [],
}) {
  return (
    <div className="w-full">
      {label && <Label className="pb-2">{label}</Label>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger placeholder="Select an option">{value}</SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <SelectItemText>{option.label}</SelectItemText>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {helperText && (
        <p className={cn("mt-1 text-sm text-muted-foreground")}>{helperText}</p>
      )}
    </div>
  );
}

export const SelectInput = React.memo(SelectInputComponent);

export { Select, SelectTrigger, SelectContent, SelectItem, SelectItemText };
