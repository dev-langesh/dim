import * as React from "react";
import { cn } from "@/utils/cn";
import { Label } from "./Label";
import { HelperText } from "./HelperText";
import Tooltip from "./Tooltip";
import { FaCircleInfo } from "react-icons/fa6";

const Input = React.forwardRef(
  (
    {
      className,
      type = "text",
      success,
      error,
      helperText,
      label,
      icon,
      iconPlacement = "left",
      value,
      onChange,
      disableStepper = false,
      inputMode,
      info,
      ...props
    },
    ref
  ) => {
    const hasIcon = !!icon;

    return (
      <div className="w-full">
        {label && (
          <Label className="pb-2" info={info}>
            {label}
          </Label>
        )}

        <div className="relative w-full">
          {hasIcon && (
            <div
              className={cn(
                "absolute top-1/2 -translate-y-1/2 text-on-muted",
                iconPlacement === "left" ? "left-3" : "right-3"
              )}
            >
              {React.isValidElement(icon)
                ? React.cloneElement(icon, {
                    className: cn("text-md", icon.props.className),
                  })
                : icon}
            </div>
          )}

          <div className="flex items-center gap-2 w-full">
            <input
              type={type}
              ref={ref}
              value={value}
              onChange={onChange}
              className={cn(
                "placeholder:text-on-muted border border-border w-full min-w-0 rounded-[6px] px-3 py-2 md:text-base shadow-xs transition-[color] outline-none",
                "focus-visible:border-border-active focus-visible:ring-ring/50 focus-visible:ring-[3px] hover:border-border-active",
                "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-disabled disabled:border-none disabled:shadow-none text-sm",
                "read-only:opacity-70 read-only:focus-visible:ring-0 read-only:focus-visible:border-border read-only:hover:border-border",
                hasIcon && iconPlacement === "left" && "pl-9",
                hasIcon && iconPlacement === "right" && "pr-9",
                error &&
                  "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20 hover:border-destructive shadow-none",
                success &&
                  "border-success focus-visible:border-success focus-visible:ring-success/20 hover:border-success shadow-none",
                className
              )}
              {...props}
            />
            {
              !label && info && (
                <Tooltip text={info}>
                  <FaCircleInfo className="text-on-muted" />
                </Tooltip>
              )
            }
          </div>
        </div>

        <HelperText text={helperText} error={error} success={success} />
      </div>
    );
  }
);

export default React.memo(Input);
