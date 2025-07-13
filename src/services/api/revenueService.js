import revenueData from "@/services/mockData/revenueData.json";

class RevenueService {
  async getRevenueData() {
    await this.simulateDelay();
    return [...revenueData];
  }

  simulateDelay() {
    return new Promise(resolve => setTimeout(resolve, 250));
  }
}

export default new RevenueService();