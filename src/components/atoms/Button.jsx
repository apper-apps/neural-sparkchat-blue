import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  children, 
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl",
    secondary: "bg-gradient-to-r from-secondary to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700 shadow-lg hover:shadow-xl",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
    ghost: "text-gray-600 hover:text-primary hover:bg-surface",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base"
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;