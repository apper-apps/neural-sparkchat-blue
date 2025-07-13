import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import planService from "@/services/api/planService";
import { toast } from "react-toastify";

const PlanBuilder = ({ onPlanCreated }) => {
  const [planData, setPlanData] = useState({
    name: "",
    price: "",
    messageLimit: "",
    features: []
  });
  const [loading, setLoading] = useState(false);

  const availableFeatures = [
    { id: "chat", name: "AI Chat Access", description: "Basic AI chatbot interactions" },
    { id: "api", name: "API Access", description: "Programmatic access to chatbot" },
    { id: "analytics", name: "Usage Analytics", description: "Detailed usage statistics" },
    { id: "priority", name: "Priority Support", description: "Faster response times" },
    { id: "custom", name: "Custom Branding", description: "White-label the chatbot" },
    { id: "integrations", name: "Third-party Integrations", description: "Connect with other tools" }
  ];

  const handleFeatureToggle = (featureId) => {
    const currentFeatures = [...planData.features];
    const index = currentFeatures.indexOf(featureId);
    
    if (index > -1) {
      currentFeatures.splice(index, 1);
    } else {
      currentFeatures.push(featureId);
    }
    
    setPlanData({ ...planData, features: currentFeatures });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!planData.name || !planData.price || !planData.messageLimit) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const newPlan = {
        ...planData,
        price: parseFloat(planData.price),
        messageLimit: parseInt(planData.messageLimit),
        isActive: true
      };
      
      await planService.create(newPlan);
      toast.success("Plan created successfully!");
      
      // Reset form
      setPlanData({
        name: "",
        price: "",
        messageLimit: "",
        features: []
      });
      
      if (onPlanCreated) {
        onPlanCreated();
      }
    } catch (err) {
      toast.error("Failed to create plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <h3 className="text-lg font-semibold font-manrope text-gray-900">
          Create New Plan
        </h3>
        <p className="text-sm text-gray-600">
          Build a custom subscription plan for your users
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Plan Name"
              required
              value={planData.name}
              onChange={(e) => setPlanData({ ...planData, name: e.target.value })}
              placeholder="e.g., Professional Plan"
            />
            
            <FormField
              label="Price (USD)"
              type="number"
              required
              value={planData.price}
              onChange={(e) => setPlanData({ ...planData, price: e.target.value })}
              placeholder="29.99"
            />
          </div>

          <FormField
            label="Message Limit"
            type="number"
            required
            value={planData.messageLimit}
            onChange={(e) => setPlanData({ ...planData, messageLimit: e.target.value })}
            placeholder="1000"
          />

          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Features
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableFeatures.map((feature) => (
                <div
                  key={feature.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                    planData.features.includes(feature.id)
                      ? "border-primary bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleFeatureToggle(feature.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
                      planData.features.includes(feature.id)
                        ? "border-primary bg-primary"
                        : "border-gray-300"
                    }`}>
                      {planData.features.includes(feature.id) && (
                        <ApperIcon name="Check" className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{feature.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPlanData({ name: "", price: "", messageLimit: "", features: [] })}
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                  Create Plan
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PlanBuilder;