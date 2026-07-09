import * as React from "react"
import { Pressable, Text, type PressableProps } from "react-native"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex flex-row items-center justify-center rounded-lg border border-transparent active:opacity-80",
  {
    variants: {
      variant: {
        default: "bg-primary",
        outline: "border-border bg-background",
        secondary: "bg-secondary",
        ghost: "bg-transparent",
        destructive: "bg-destructive/10",
        link: "bg-transparent",
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

const buttonTextVariants = cva(
  "text-sm font-medium",
  {
    variants: {
      variant: {
        default: "text-primary-foreground",
        outline: "text-foreground",
        secondary: "text-secondary-foreground",
        ghost: "text-foreground",
        destructive: "text-destructive",
        link: "text-primary underline",
      },
      size: {
        default: "text-sm",
        sm: "text-xs",
        lg: "text-base",
        icon: "text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends PressableProps,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode
  textClass?: string
}

const Button = React.forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
  ({ className, variant, size, children, textClass, ...props }, ref) => {
    return (
      <Pressable
        className={cn(
          buttonVariants({ variant, size }),
          props.disabled && "opacity-50",
          className
        )}
        ref={ref}
        {...props}
      >
        <Text className={cn(buttonTextVariants({ variant, size }), textClass)}>
          {children}
        </Text>
      </Pressable>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants, buttonTextVariants }
