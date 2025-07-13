import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;