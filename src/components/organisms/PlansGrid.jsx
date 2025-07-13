import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import planService from "@/services/api/planService";
import { toast } from "react-toastify";

const PlansGrid = ({ refreshTrigger }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPlans = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await planService.getAll();
      setPlans(data);
    } catch (err) {
      setError("Failed to load subscription plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, [refreshTrigger]);

  const handleToggleStatus = async (planId, currentStatus) => {
    try {
      await planService.update(planId, { isActive: !currentStatus });
      toast.success(`Plan ${!currentStatus ? "activated" : "deactivated"} successfully`);
      loadPlans();
    } catch (err) {
      toast.error("Failed to update plan status");
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) {
      return;
    }

    try {
      await planService.delete(planId);
      toast.success("Plan deleted successfully");
      loadPlans();
    } catch (err) {
      toast.error("Failed to delete plan");
    }
  };

  const getFeatureIcon = (featureId) => {
    const iconMap = {
      chat: "MessageCircle",
      api: "Code",
      analytics: "BarChart3",
      priority: "Zap",
      custom: "Palette",
      integrations: "Link"
    };
    return iconMap[featureId] || "Check";
  };

  const getFeatureName = (featureId) => {
    const nameMap = {
      chat: "AI Chat Access",
      api: "API Access", 
      analytics: "Usage Analytics",
      priority: "Priority Support",
      custom: "Custom Branding",
      integrations: "Integrations"
    };
    return nameMap[featureId] || featureId;
  };

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return (
      <div className="flex justify-center">
        <Error message={error} onRetry={loadPlans} type="data" />
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="flex justify-center">
        <Empty type="plans" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <Card key={plan.Id} className="hover:shadow-xl transition-all duration-300 group">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold font-manrope text-gray-900 group-hover:text-primary transition-colors duration-200">
                  {plan.name}
                </h3>
                <div className="flex items-baseline mt-2">
                  <span className="text-3xl font-bold font-manrope bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    ${plan.price}
                  </span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>
              </div>
              <Badge variant={plan.isActive ? "success" : "warning"}>
                {plan.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center text-sm text-gray-600">
                <ApperIcon name="MessageSquare" className="w-4 h-4 mr-2 text-primary" />
                <span>{plan.messageLimit.toLocaleString()} messages/month</span>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900">Features</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <ApperIcon 
                        name={getFeatureIcon(feature)} 
                        className="w-4 h-4 mr-2 text-success" 
                      />
                      <span>{getFeatureName(feature)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleToggleStatus(plan.Id, plan.isActive)}
            >
              <ApperIcon 
                name={plan.isActive ? "Pause" : "Play"} 
                className="w-4 h-4 mr-1" 
              />
              {plan.isActive ? "Deactivate" : "Activate"}
            </Button>
            
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm">
                <ApperIcon name="Edit" className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleDeletePlan(plan.Id)}
                className="text-error hover:text-error hover:bg-red-50"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PlansGrid;