import { GripVertical } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@/lib/utils"

const ResizablePanelGroup = ({ className,
  ...props
 }.ComponentProps) => (
  
)

const ResizablePanel = ResizablePrimitive.Panel

const ResizableHandle = ({ withHandle,
  className,
  ...props
 }.ComponentProps & {
  withHandle?: boolean
}) => (
  div]:rotate-90",
      className
    )}
    {...props}
  >
    {withHandle && (

    )}
  
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }


