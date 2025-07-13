import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon, 
  className,
  gradient = "primary"
}) => {
  const gradients = {
    primary: "from-primary to-blue-600",
    success: "from-success to-emerald-600",
    warning: "from-warning to-yellow-600",
    secondary: "from-secondary to-indigo-600"
  };

  const changeColors = {
    positive: "text-success",
    negative: "text-error",
    neutral: "text-gray-500"
  };

  return (
    <Card className={cn("group hover:shadow-xl transition-all duration-300", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold font-manrope bg-gradient-to-r bg-clip-text text-transparent" 
               style={{backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`, 
                      '--tw-gradient-from': '#1f2937', '--tw-gradient-to': '#374151'}}>
              {value}
            </p>
            {change && (
              <div className="flex items-center mt-2">
                <ApperIcon 
                  name={changeType === "positive" ? "TrendingUp" : changeType === "negative" ? "TrendingDown" : "Minus"} 
                  className={cn("w-4 h-4 mr-1", changeColors[changeType])} 
                />
                <span className={cn("text-sm font-medium", changeColors[changeType])}>
                  {change}
                </span>
              </div>
            )}
          </div>
          <div className={cn(
            "w-12 h-12 rounded-xl bg-gradient-to-r flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300",
            gradients[gradient]
          )}>
            <ApperIcon name={icon} className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;