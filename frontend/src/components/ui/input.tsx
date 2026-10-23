import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border border-sage-border bg-cream-elevated px-3.5 py-2 text-base text-forest-dark shadow-sm transition-all placeholder:text-forest-muted/60 focus-visible:outline-none focus-visible:border-terracotta focus-visible:ring-2 focus-visible:ring-terracotta/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
