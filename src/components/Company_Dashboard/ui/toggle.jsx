import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva,  } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover=on]:bg-accent data-[state=on]:text-accent-foreground",
  {
    variants,
        outline,
      },
      size,
        sm,
        lg,
      },
    },
    defaultVariants,
      size,
    },
  }
)

const Toggle = React.forwardRef,
  React.ComponentPropsWithoutRef &
    VariantProps
>(({ className, variant, size, ...props }, ref) => (
  
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }


