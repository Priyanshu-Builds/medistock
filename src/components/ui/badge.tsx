import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border border-transparent px-3 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3.5 gap-1.5 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-all duration-200 overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90 shadow-sm",
        secondary:
          "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        ghost: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        link: "text-primary underline-offset-4 [a&]:hover:underline",
        // Medical status badges
        success: 
          "bg-success/15 text-success border-success/30 dark:bg-success/20 dark:text-success font-semibold",
        warning:
          "bg-warning/15 text-warning border-warning/30 dark:bg-warning/20 dark:text-warning font-semibold animate-pulse-soft",
        expired:
          "bg-expired/15 text-expired border-expired/30 dark:bg-expired/20 dark:text-expired font-semibold",
        info:
          "bg-info/15 text-info border-info/30 dark:bg-info/20 dark:text-info font-semibold",
        // Glow variants for attention
        "success-glow":
          "bg-success text-white glow-success font-semibold",
        "warning-glow":
          "bg-warning text-white glow-warning font-semibold animate-pulse-soft",
        "expired-glow":
          "bg-expired text-white glow-danger font-semibold",
        // Outline status variants
        "success-outline":
          "border-success text-success bg-transparent hover:bg-success/10",
        "warning-outline":
          "border-warning text-warning bg-transparent hover:bg-warning/10",
        "expired-outline":
          "border-expired text-expired bg-transparent hover:bg-expired/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

// Convenience components for medical status badges
function StatusBadge({ 
  status, 
  className,
  glow = false,
  ...props 
}: React.ComponentProps<"span"> & { 
  status: "in-stock" | "low-stock" | "expired" | "expiring-soon" | "out-of-stock"
  glow?: boolean
}) {
  const statusConfig = {
    "in-stock": { variant: glow ? "success-glow" : "success", label: "In Stock" },
    "low-stock": { variant: glow ? "warning-glow" : "warning", label: "Low Stock" },
    "expired": { variant: glow ? "expired-glow" : "expired", label: "Expired" },
    "expiring-soon": { variant: "warning-outline" as const, label: "Expiring Soon" },
    "out-of-stock": { variant: glow ? "expired-glow" : "expired", label: "Out of Stock" },
  }
  
  const config = statusConfig[status]
  
  return (
    <Badge 
      variant={config.variant as any} 
      className={className}
      {...props}
    >
      {props.children || config.label}
    </Badge>
  )
}

function MedicineCategoryBadge({ 
  category,
  className,
  ...props 
}: React.ComponentProps<"span"> & { 
  category: string
}) {
  return (
    <Badge 
      variant="secondary" 
      className={cn("text-xs", className)}
      {...props}
    >
      {category}
    </Badge>
  )
}

export { Badge, badgeVariants, StatusBadge, MedicineCategoryBadge }
