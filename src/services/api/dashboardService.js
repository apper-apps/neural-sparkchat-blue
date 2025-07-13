import activitiesData from "@/services/mockData/activities.json";

class DashboardService {
  async getMetrics() {
    await this.simulateDelay();
    
    return {
      totalSubscribers: 168,
      subscribersChange: "+12.5%",
      subscribersChangeType: "positive",
      monthlyRevenue: 45600,
      revenueChange: "+18.2%",
      revenueChangeType: "positive",
      activePlans: 4,
      plansChange: "+1",
      plansChangeType: "positive",
      newUsersToday: 8,
      newUsersChange: "+25%",
      newUsersChangeType: "positive"
    };
  }

  async getRecentActivities() {
    await this.simulateDelay();
    return [...activitiesData].slice(0, 6);
  }

  simulateDelay() {
    return new Promise(resolve => setTimeout(resolve, 200));
  }
}

export default new DashboardService();