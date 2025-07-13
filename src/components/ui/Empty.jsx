import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  icon = "Inbox",
  title = "No data found",
  description = "There's nothing here yet. Get started by adding some content.",
  actionText,
  onAction,
  type = "general"
}) => {
  const getEmptyConfig = () => {
    switch (type) {
      case "users":
        return {
          icon: "Users",
          title: "No users yet",
          description: "Your user base is empty. Users will appear here once they start subscribing to your plans.",
          actionText: "Invite Users"
        };
      case "plans":
        return {
          icon: "Package",
          title: "No subscription plans",
          description: "Create your first subscription plan to start offering your AI chatbot services.",
          actionText: "Create Plan"
        };
      case "invoices":
        return {
          icon: "FileText",
          title: "No invoices found",
          description: "Invoice history will appear here once payments are processed.",
          actionText: "View Billing"
        };
      case "analytics":
        return {
          icon: "BarChart3",
          title: "No analytics data",
          description: "Analytics will be available once you have active users and subscriptions.",
          actionText: "Refresh Data"
        };
      default:
        return { icon, title, description, actionText };
    }
  };

  const config = getEmptyConfig();

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
          <ApperIcon name={config.icon} className="w-8 h-8 text-gray-400" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 font-manrope">
          {config.title}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {config.description}
        </p>
        
        {(actionText || config.actionText) && onAction && (
          <Button onClick={onAction} variant="primary">
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            {actionText || config.actionText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default Empty;