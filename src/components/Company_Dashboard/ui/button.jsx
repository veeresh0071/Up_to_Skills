import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "../../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative ",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
        outline:
          "border-2 border-primary bg-background text-primary hover:bg-primary hover:text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
        ghost: "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-accent dark:hover:text-accent-foreground transition-all duration-300 hover:-translate-y-1",
        link: "text-primary underline-offset-4 hover:underline transition-all duration-300",
        premium: "bg-gradient-to-r from-logo-primary to-logo-secondary text-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        glow: "bg-primary text-primary-foreground shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/50 relative before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-primary-glow before:to-primary before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        logo: "bg-gradient-to-r from-logo-primary to-logo-secondary text-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-110 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/30 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
        glass: "bg-white/10 backdrop-blur-md border border-white/20 text-foreground hover:bg-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }


