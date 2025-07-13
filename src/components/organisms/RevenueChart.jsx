import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardHeader, CardContent } from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import revenueService from "@/services/api/revenueService";

const RevenueChart = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRevenueData = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await revenueService.getRevenueData();
      setRevenueData(data);
    } catch (err) {
      setError("Failed to load revenue data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRevenueData();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8">
          <Error message={error} onRetry={loadRevenueData} type="data" />
        </CardContent>
      </Card>
    );
  }

  const chartOptions = {
    chart: {
      type: "area",
      height: 300,
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 3,
      colors: ["#3B82F6"]
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 90, 100],
        colorStops: [
          {
            offset: 0,
            color: "#3B82F6",
            opacity: 0.7
          },
          {
            offset: 100,
            color: "#3B82F6",
            opacity: 0.1
          }
        ]
      }
    },
    grid: {
      strokeDashArray: 3,
      borderColor: "#E5E7EB"
    },
    xaxis: {
      categories: revenueData.map(item => item.month),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: "#6B7280", fontSize: "12px" }
      }
    },
    yaxis: {
      labels: {
        style: { colors: "#6B7280", fontSize: "12px" },
        formatter: (value) => `$${value.toLocaleString()}`
      }
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: (value) => `$${value.toLocaleString()}`
      }
    }
  };

  const series = [{
    name: "Revenue",
    data: revenueData.map(item => item.revenue)
  }];

  return (
    <Card className="hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <h3 className="text-lg font-semibold font-manrope text-gray-900">
          Monthly Revenue
        </h3>
        <p className="text-sm text-gray-600">
          Revenue trends over the last 12 months
        </p>
      </CardHeader>
      <CardContent>
        <ReactApexChart
          options={chartOptions}
          series={series}
          type="area"
          height={300}
        />
      </CardContent>
    </Card>
  );
};

export default RevenueChart;