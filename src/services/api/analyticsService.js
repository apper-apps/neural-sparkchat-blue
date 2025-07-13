import analyticsData from "@/services/mockData/analytics.json";

class AnalyticsService {
  async getAnalytics(timeRange = "30d") {
    await this.simulateDelay();
    
    // Simulate different data based on time range
    let filteredUserGrowth = [...analyticsData.userGrowth];
    
    if (timeRange === "7d") {
      filteredUserGrowth = filteredUserGrowth.slice(-1);
    } else if (timeRange === "90d") {
      // Simulate more data points for 90 days
      filteredUserGrowth = [
        ...filteredUserGrowth,
        { date: "2024-02-12", newUsers: 35, totalUsers: 203 },
        { date: "2024-02-19", newUsers: 42, totalUsers: 245 }
      ];
    }

    return {
      userGrowth: filteredUserGrowth,
      planDistribution: [...analyticsData.planDistribution]
    };
  }

  simulateDelay() {
    return new Promise(resolve => setTimeout(resolve, 450));
  }
}

export default new AnalyticsService();