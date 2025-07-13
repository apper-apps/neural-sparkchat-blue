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
// Filter subscriber trends based on time range
    let filteredSubscriberTrends = [...analyticsData.subscriberTrends];
    let filteredChurnAnalysis = [...analyticsData.churnAnalysis];
    
    if (timeRange === "7d") {
      filteredSubscriberTrends = filteredSubscriberTrends.slice(-1);
      filteredChurnAnalysis = filteredChurnAnalysis.slice(-1);
    } else if (timeRange === "90d") {
      filteredSubscriberTrends = [
        ...filteredSubscriberTrends,
        { date: "2024-02-12", newSubscribers: 24, totalSubscribers: 137, churnedSubscribers: 3, growthPercentage: 18.8 },
        { date: "2024-02-19", newSubscribers: 28, totalSubscribers: 162, churnedSubscribers: 3, growthPercentage: 18.2 }
      ];
    }

    return {
      userGrowth: filteredUserGrowth,
      planDistribution: [...analyticsData.planDistribution],
      subscriberTrends: filteredSubscriberTrends,
      churnAnalysis: filteredChurnAnalysis,
      growthMetrics: { ...analyticsData.growthMetrics },
      comparativeAnalysis: { ...analyticsData.comparativeAnalysis }
    };
  }

  async getSubscriberGrowth(timeRange = "30d") {
    await this.simulateDelay();
    return this.getAnalytics(timeRange);
  }

  async getChurnAnalysis(timeRange = "30d") {
    await this.simulateDelay();
    return this.getAnalytics(timeRange);
  }

  async getRealTimeUpdate() {
    await this.simulateDelay(200);
    
    // Simulate real-time data updates
    const latestData = await this.getAnalytics();
    const realTimeMetrics = {
      ...latestData.growthMetrics,
      lastUpdated: new Date().toISOString(),
      liveSubscribers: latestData.subscriberTrends[latestData.subscriberTrends.length - 1]?.totalSubscribers + Math.floor(Math.random() * 5),
      currentChurnRate: (4.2 + (Math.random() - 0.5) * 0.8).toFixed(1)
    };
    
    return { ...latestData, realTimeMetrics };
  }

  calculateGrowthPercentage(current, previous) {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  }

  calculateChurnRate(churned, total) {
    if (!total || total === 0) return 0;
    return ((churned / total) * 100).toFixed(1);
  }

  simulateDelay(ms = 450) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new AnalyticsService();