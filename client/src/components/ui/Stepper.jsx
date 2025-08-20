"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/cn";

const stepperVariants = cva("flex items-start justify-start w-full gap-2", {
  variants: {
    size: {
      xs: "",
      sm: "",
      md: "",
      lg: "",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const stepIndicatorVariants = cva(
  "rounded-[3px] flex items-center justify-center font-[700] transition-colors",
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
  xs: "text-md",
  sm: "text-md",
  md: "text-md",
  lg: "text-lg",
};

const labelVariants = cva(
  "font-[700] transition-colors text-center whitespace-nowrap",
  {
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
    },
    defaultVariants: {
      size: "md",
      active: false,
    },
  }
);

const lineVariants = cva(
  "transition-colors rounded-full w-full h-[1.3px] transform ",
  {
    variants: {
      active: {
        true: "bg-primary",
        false: "bg-border",
      },
      size: {
        xs: "translate-y-6",
        sm: "translate-y-7",
        md: "translate-y-8",
        lg: "translate-y-9",
      },
    },
    defaultVariants: {
      active: false,
    },
  }
);

function StepperComponent({ currentStep, steps, size = "md", className }) {
  return (
    <div className={cn(stepperVariants({ size }), className)}>
      {steps.map((step, index) => {
        const isActive = index + 1 <= currentStep;
        const isLast = index === steps.length - 1;
        const highlightLine = index + 1 < currentStep;

        return (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center gap-2">
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
              <div className={labelVariants({ active: isActive, size })}>
                {step.name}
              </div>
            </div>
            {!isLast && (
              <div className={lineVariants({ active: highlightLine, size })} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export const Stepper = React.memo(StepperComponent);
