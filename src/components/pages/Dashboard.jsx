import React, { useState, useEffect } from "react";
import MetricCard from "@/components/molecules/MetricCard";
import RevenueChart from "@/components/organisms/RevenueChart";
import { Card, CardHeader, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import dashboardService from "@/services/api/dashboardService";

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const [metricsData, activitiesData] = await Promise.all([
        dashboardService.getMetrics(),
        dashboardService.getRecentActivities()
      ]);
      setMetrics(metricsData);
      setRecentActivities(activitiesData);
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return <Loading type="dashboard" />;
  }

  if (error) {
    return (
      <div className="flex justify-center">
        <Error message={error} onRetry={loadDashboardData} type="data" />
      </div>
    );
  }

  const getActivityIcon = (type) => {
    const iconMap = {
      user_registered: "UserPlus",
      subscription_created: "CreditCard",
      payment_received: "DollarSign",
      plan_created: "Package",
      user_suspended: "UserX"
    };
    return iconMap[type] || "Activity";
  };

  const getActivityColor = (type) => {
    const colorMap = {
      user_registered: "success",
      subscription_created: "info",
      payment_received: "success",
      plan_created: "secondary",
      user_suspended: "warning"
    };
    return colorMap[type] || "default";
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold font-manrope mb-2">
          Welcome to SparkChat Hub
        </h1>
        <p className="text-blue-100">
          Manage your AI chatbot subscriptions and track your business growth
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Subscribers"
          value={metrics?.totalSubscribers || 0}
          change={metrics?.subscribersChange || "+0%"}
          changeType={metrics?.subscribersChangeType || "neutral"}
          icon="Users"
          gradient="primary"
        />
        <MetricCard
          title="Monthly Revenue"
          value={`$${metrics?.monthlyRevenue?.toLocaleString() || 0}`}
          change={metrics?.revenueChange || "+0%"}
          changeType={metrics?.revenueChangeType || "neutral"}
          icon="DollarSign"
          gradient="success"
        />
        <MetricCard
          title="Active Plans"
          value={metrics?.activePlans || 0}
          change={metrics?.plansChange || "+0"}
          changeType={metrics?.plansChangeType || "neutral"}
          icon="Package"
          gradient="secondary"
        />
        <MetricCard
          title="New Users Today"
          value={metrics?.newUsersToday || 0}
          change={metrics?.newUsersChange || "+0%"}
          changeType={metrics?.newUsersChangeType || "neutral"}
          icon="UserPlus"
          gradient="warning"
        />
      </div>

      {/* Charts and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        
        <Card className="hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <h3 className="text-lg font-semibold font-manrope text-gray-900">
              Recent Activities
            </h3>
            <p className="text-sm text-gray-600">
              Latest system activities and events
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.Id} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <ApperIcon 
                      name={getActivityIcon(activity.type)} 
                      className="w-4 h-4 text-gray-600" 
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </span>
                      <Badge variant={getActivityColor(activity.type)} className="text-xs">
                        {activity.type.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;