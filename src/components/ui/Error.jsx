import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong. Please try again.", 
  onRetry,
  type = "general"
}) => {
  const getErrorConfig = () => {
    switch (type) {
      case "network":
        return {
          icon: "Wifi",
          title: "Connection Error",
          description: "Unable to connect to our servers. Please check your internet connection and try again."
        };
      case "data":
        return {
          icon: "Database",
          title: "Data Error", 
          description: "We couldn't load the requested data. This might be a temporary issue."
        };
      case "permission":
        return {
          icon: "Lock",
          title: "Access Denied",
          description: "You don't have permission to access this resource."
        };
      default:
        return {
          icon: "AlertTriangle",
          title: "Oops! Something went wrong",
          description: message
        };
    }
  };

  const config = getErrorConfig();

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-error to-red-600 rounded-full flex items-center justify-center shadow-lg">
          <ApperIcon name={config.icon} className="w-8 h-8 text-white" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 font-manrope">
          {config.title}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {config.description}
        </p>
        
        {onRetry && (
          <Button onClick={onRetry} className="w-full">
            <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default Error;