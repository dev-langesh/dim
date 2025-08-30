// components/ui/select.tsx
"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "@/utils/cn";
import { Label } from "./Label";
import { IoIosArrowDown } from "react-icons/io";

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
        "flex gap-2 items-center justify-between w-full rounded-[6px] border bg-transparent px-3 py-2 text-sm md:text-base shadow-xs outline-none transition-colors hover:border-border-active border-border",
        "disabled:cursor-not-allowed disabled:bg-disabled disabled:border-none disabled:shadow-none",
        "data-[placeholder]:text-on-muted cursor-pointer",
        className
      )}
      {...props}
    >
      <SelectPrimitive.Value
        placeholder={placeholder}
        className="data-[placeholder]:text-on-muted"
      >
        {children}
      </SelectPrimitive.Value>
      <SelectPrimitive.Icon>
        <IoIosArrowDown className="data-[placeholder]:text-on-muted" />
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
          "rounded-[6px] border border-border shadow-xs focus:outline-none bg-zinc-50",
          className
        )}
        {...props}
      >
        <SelectPrimitive.Viewport>{props.children}</SelectPrimitive.Viewport>
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
        "cursor-pointer select-none px-3 py-2 text-sm md:text-base text-on-muted hover:bg-zinc-100",
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
  error,
  success,
  helperText,
  options = [],
  placeholder,
  ...props
}) {
  return (
    <div className="w-full">
      {label && <Label className="pb-2">{label}</Label>}
      <Select
        value={value === "" ? undefined : value}
        onValueChange={onChange}
        {...props}
      >
        <SelectTrigger
          placeholder={placeholder || "Select an option"}
          className={cn(
            error && "border-destructive",
            success && "border-success"
          )}
        />

        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <SelectItemText>{option.label}</SelectItemText>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {helperText && (
        <p
          className={cn(
            "mt-1 text-sm text-on-muted",
            error && "text-destructive",
            success && "text-success"
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}

export const SelectInput = React.memo(SelectInputComponent);

export { Select, SelectTrigger, SelectContent, SelectItem, SelectItemText };
