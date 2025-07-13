import plansData from "@/services/mockData/plans.json";

class PlanService {
  constructor() {
    this.plans = [...plansData];
  }

  async getAll() {
    await this.simulateDelay();
    return [...this.plans];
  }

  async getById(id) {
    await this.simulateDelay();
    const plan = this.plans.find(p => p.Id === parseInt(id));
    if (!plan) {
      throw new Error("Plan not found");
    }
    return { ...plan };
  }

  async create(planData) {
    await this.simulateDelay();
    const newPlan = {
      Id: Math.max(...this.plans.map(p => p.Id)) + 1,
      ...planData
    };
    this.plans.push(newPlan);
    return { ...newPlan };
  }

  async update(id, updates) {
    await this.simulateDelay();
    const index = this.plans.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Plan not found");
    }
    this.plans[index] = { ...this.plans[index], ...updates };
    return { ...this.plans[index] };
  }

  async delete(id) {
    await this.simulateDelay();
    const index = this.plans.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Plan not found");
    }
    this.plans.splice(index, 1);
    return true;
  }

  simulateDelay() {
    return new Promise(resolve => setTimeout(resolve, 350));
  }
}

export default new PlanService();