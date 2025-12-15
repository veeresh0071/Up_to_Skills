import * as React from "react"
import { cva,  } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants,
        destructive,
      },
    },
    defaultVariants,
    },
  }
)

const Alert = React.forwardRef & VariantProps
>(({ className, variant, ...props }, ref) => (
  
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef
>(({ className, ...props }, ref) => (
  
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef
>(({ className, ...props }, ref) => (
  
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }


