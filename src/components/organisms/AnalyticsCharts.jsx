import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardHeader, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import analyticsService from "@/services/api/analyticsService";

const AnalyticsCharts = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("30d");

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await analyticsService.getAnalytics(timeRange);
      setAnalyticsData(data);
    } catch (err) {
      setError("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  if (loading) {
    return <Loading type="dashboard" />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8">
          <Error message={error} onRetry={loadAnalytics} type="data" />
        </CardContent>
      </Card>
    );
  }

  const userGrowthOptions = {
    chart: {
      type: "line",
      height: 300,
      toolbar: { show: false }
    },
    stroke: {
      curve: "smooth",
      width: 3,
      colors: ["#3B82F6", "#10B981"]
    },
    grid: {
      strokeDashArray: 3,
      borderColor: "#E5E7EB"
    },
    xaxis: {
      categories: analyticsData?.userGrowth?.map(item => item.date) || [],
      labels: {
        style: { colors: "#6B7280", fontSize: "12px" }
      }
    },
    yaxis: {
      labels: {
        style: { colors: "#6B7280", fontSize: "12px" }
      }
    },
    legend: {
      position: "top"
    },
    tooltip: {
      theme: "light"
    }
  };

  const userGrowthSeries = [
    {
      name: "New Users",
      data: analyticsData?.userGrowth?.map(item => item.newUsers) || []
    },
    {
      name: "Total Users",
      data: analyticsData?.userGrowth?.map(item => item.totalUsers) || []
    }
  ];

  const planDistributionOptions = {
    chart: {
      type: "donut",
      height: 300
    },
    colors: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"],
    labels: analyticsData?.planDistribution?.map(item => item.planName) || [],
    legend: {
      position: "bottom"
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%"
        }
      }
    },
    tooltip: {
      y: {
        formatter: (value) => `${value} users`
      }
    }
  };

  const planDistributionSeries = analyticsData?.planDistribution?.map(item => item.userCount) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-manrope text-gray-900">
          Analytics Dashboard
        </h2>
        <div className="flex space-x-2">
          {["7d", "30d", "90d"].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "primary" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <h3 className="text-lg font-semibold font-manrope text-gray-900">
              User Growth
            </h3>
            <p className="text-sm text-gray-600">
              New and total users over time
            </p>
          </CardHeader>
          <CardContent>
            <ReactApexChart
              options={userGrowthOptions}
              series={userGrowthSeries}
              type="line"
              height={300}
            />
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <h3 className="text-lg font-semibold font-manrope text-gray-900">
              Plan Distribution
            </h3>
            <p className="text-sm text-gray-600">
              Users by subscription plan
            </p>
          </CardHeader>
          <CardContent>
            <ReactApexChart
              options={planDistributionOptions}
              series={planDistributionSeries}
              type="donut"
              height={300}
            />
          </CardContent>
        </Card>
      </div>

      <Card className="hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold font-manrope text-gray-900">
                Export Analytics
              </h3>
              <p className="text-sm text-gray-600">
                Download detailed analytics reports
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <ApperIcon name="FileText" className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline">
                <ApperIcon name="FileSpreadsheet" className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};

export default AnalyticsCharts;