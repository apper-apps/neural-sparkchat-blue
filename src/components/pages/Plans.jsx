import React, { useState } from "react";
import PlanBuilder from "@/components/organisms/PlanBuilder";
import PlansGrid from "@/components/organisms/PlansGrid";

const Plans = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handlePlanCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-manrope text-gray-900 mb-2">
          Subscription Plans
        </h1>
        <p className="text-gray-600">
          Create and manage subscription plans for your AI chatbot service
        </p>
      </div>
      
      <PlanBuilder onPlanCreated={handlePlanCreated} />
      
      <div>
        <h2 className="text-xl font-semibold font-manrope text-gray-900 mb-4">
          Existing Plans
        </h2>
        <PlansGrid refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
};

export default Plans;