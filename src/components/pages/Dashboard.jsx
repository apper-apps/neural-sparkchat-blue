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
    <div className="space-y-8">
      {/* Welcome Section - Enhanced */}
      <div className="bg-gradient-to-r from-primary via-blue-600 to-secondary rounded-xl p-8 text-white shadow-xl border border-blue-200/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-manrope mb-3 tracking-tight">
              Welcome to SparkChat Hub
            </h1>
            <p className="text-blue-100 text-lg">
              Manage your AI chatbot subscriptions and track your business growth
            </p>
            <div className="mt-4 flex items-center space-x-4 text-blue-200">
              <div className="flex items-center">
                <ApperIcon name="Users" className="w-5 h-5 mr-2" />
                <span className="text-sm">Active Dashboard</span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="TrendingUp" className="w-5 h-5 mr-2" />
                <span className="text-sm">Real-time Updates</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <ApperIcon name="BarChart3" className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

{/* Metrics Cards - Enhanced Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="transform hover:scale-105 transition-all duration-300">
          <MetricCard
            title="Total Subscribers"
            value={metrics?.totalSubscribers || 0}
            change={metrics?.subscribersChange || "+0%"}
            changeType={metrics?.subscribersChangeType || "neutral"}
            icon="Users"
            gradient="primary"
          />
        </div>
        <div className="transform hover:scale-105 transition-all duration-300">
          <MetricCard
            title="Monthly Revenue"
            value={`$${metrics?.monthlyRevenue?.toLocaleString() || 0}`}
            change={metrics?.revenueChange || "+0%"}
            changeType={metrics?.revenueChangeType || "neutral"}
            icon="DollarSign"
            gradient="success"
          />
        </div>
        <div className="transform hover:scale-105 transition-all duration-300">
          <MetricCard
            title="Subscriber Growth"
            value={`${metrics?.subscriberGrowthRate || 0}%`}
            change={metrics?.growthChange || "+0%"}
            changeType={metrics?.growthChangeType || "positive"}
            icon="TrendingUp"
            gradient="accent"
          />
        </div>
        <div className="transform hover:scale-105 transition-all duration-300">
          <MetricCard
            title="Churn Rate"
            value={`${metrics?.churnRate || 0}%`}
            change={metrics?.churnChange || "-0%"}
            changeType={metrics?.churnChangeType || "negative"}
            icon="UserMinus"
            gradient="warning"
          />
        </div>
      </div>

{/* Charts and Activities - Enhanced Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <div className="transform hover:shadow-2xl transition-all duration-300">
            <RevenueChart />
          </div>
        </div>
        
        <Card className="hover:shadow-2xl transition-all duration-300 border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold font-manrope text-gray-900">
                  Recent Activities
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Latest system activities and events
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Activity" className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="max-h-96 overflow-y-auto pr-2">
              {recentActivities.map((activity, index) => (
                <div 
                  key={activity.Id} 
                  className={`flex items-start space-x-4 p-3 rounded-lg transition-all duration-200 hover:bg-gray-50 ${index !== recentActivities.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <ApperIcon 
                      name={getActivityIcon(activity.type)} 
                      className="w-5 h-5 text-gray-600" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 leading-relaxed">{activity.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500 font-medium">
                        {new Date(activity.timestamp).toLocaleString()}
                      </span>
                      <Badge variant={getActivityColor(activity.type)} className="text-xs px-2 py-1">
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

      {/* Quick Actions Section */}
      <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold font-manrope text-gray-900">
                Quick Actions
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Frequently used management tools
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <ApperIcon name="UserPlus" className="w-8 h-8 mb-2" />
              <span className="text-sm font-medium">Add User</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-accent to-green-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <ApperIcon name="Package" className="w-8 h-8 mb-2" />
              <span className="text-sm font-medium">New Plan</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-secondary to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <ApperIcon name="FileText" className="w-8 h-8 mb-2" />
              <span className="text-sm font-medium">Reports</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-warning to-yellow-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <ApperIcon name="Settings" className="w-8 h-8 mb-2" />
              <span className="text-sm font-medium">Settings</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;