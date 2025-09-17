"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/cn";

const stepperVariants = cva("flex w-full gap-2", {
  variants: {
    orientation: {
      horizontal: "flex-row items-start justify-start",
      vertical: "flex-col items-start justify-start",
    },
    size: {
      xs: "",
      sm: "",
      md: "",
      lg: "",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    size: "md",
  },
});

const stepIndicatorVariants = cva(
  "rounded-[3px] flex items-center justify-center font-[700] transition-colors shrink-0",
  {
    variants: {
      active: {
        true: "bg-primary text-white",
        false: "bg-disabled text-muted-foreground",
      },
      size: {
        xs: "w-6 h-6 text-xs",
        sm: "w-7 h-7 text-xs",
        md: "w-8 h-8 text-sm",
        lg: "w-9 h-9 text-base",
      },
    },
    defaultVariants: {
      size: "md",
      active: false,
    },
  }
);

const iconSizeVariants = {
  xs: "text-sm",
  sm: "text-sm",
  md: "text-md",
  lg: "text-lg",
};

const labelVariants = cva("font-[700] transition-colors whitespace-nowrap", {
  variants: {
    active: {
      true: "text-black",
      false: "text-on-muted",
    },
    size: {
      xs: "text-xs",
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    },
    orientation: {
      horizontal: "text-center",
      vertical: "text-left",
    },
  },
  defaultVariants: {
    size: "md",
    active: false,
    orientation: "horizontal",
  },
});

const lineVariants = cva("flex-1 transition-colors rounded-full shrink-0", {
  variants: {
    active: {
      true: "bg-primary",
      false: "bg-border",
    },
    size: {
      xs: "",
      sm: "",
      md: "",
      lg: "",
    },
    orientation: {
      horizontal: "h-[1.3px] translate-y-6",
      vertical: "w-[1.3px] translate-x-3",
    },
  },
  defaultVariants: {
    active: false,
    orientation: "horizontal",
  },
});

function StepperComponent({
  currentStep,
  steps,
  size = "md",
  orientation = "horizontal",
  className,
}) {
  return (
    <div className={cn(stepperVariants({ size, orientation }), className)}>
      {steps.map((step, index) => {
        const isActive = index + 1 <= currentStep;
        const isLast = index === steps.length - 1;
        const highlightLine = index + 1 < currentStep;

        return (
          <React.Fragment key={index}>
            <div
              className={cn(
                "flex gap-2",
                orientation === "horizontal"
                  ? "flex-col items-center"
                  : "flex-row items-center"
              )}
            >
              <div
                className={stepIndicatorVariants({ active: isActive, size })}
              >
                {React.isValidElement(step.icon)
                  ? React.cloneElement(step.icon, {
                      className: cn(
                        iconSizeVariants[size ?? "md"],
                        isActive ? "!text-white" : "!text-on-muted",
                        step.icon.props.className
                      ),
                    })
                  : step.icon || index + 1}
              </div>
              <div
                className={labelVariants({
                  active: isActive,
                  size,
                  orientation,
                })}
              >
                {step.name}
              </div>
            </div>
            {!isLast && (
              <div
                className={cn(
                  lineVariants({
                    active: highlightLine,
                    size,
                    orientation,
                  }),
                  size === "lg" && orientation === "vertical" && "translate-x-4"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export const Stepper = React.memo(StepperComponent);
