import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/src/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-red-500 text-white",
        outline: "text-foreground border-border",
        glass: "border-border bg-card text-foreground backdrop-blur-sm",
        success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
        n1: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
        n2: "bg-primary/10 text-primary border border-primary/20",
        n3: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border border-yellow-500/20",
        n4: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20",
        n5: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
