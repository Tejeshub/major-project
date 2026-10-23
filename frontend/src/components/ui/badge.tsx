import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring/40 focus:ring-offset-1",
  {
    variants: {
      variant: {
        default: "border-transparent bg-terracotta text-cream-bg shadow-sm hover:bg-terracotta-hover",
        forest: "border-transparent bg-forest-dark text-cream-bg hover:bg-[#273C2F]",
        secondary:
          "border-sage-border bg-secondary text-forest-dark hover:bg-[#E7E0D3]",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "border-sage-border text-forest-dark bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
