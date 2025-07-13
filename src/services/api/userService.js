import usersData from "@/services/mockData/users.json";

class UserService {
  constructor() {
    this.users = [...usersData];
  }

  async getAll() {
    await this.simulateDelay();
    return [...this.users];
  }

  async getById(id) {
    await this.simulateDelay();
    const user = this.users.find(u => u.Id === parseInt(id));
    if (!user) {
      throw new Error("User not found");
    }
    return { ...user };
  }

  async create(userData) {
    await this.simulateDelay();
    const newUser = {
      Id: Math.max(...this.users.map(u => u.Id)) + 1,
      ...userData,
      createdAt: new Date().toISOString(),
      status: "active"
    };
    this.users.push(newUser);
    return { ...newUser };
  }

  async update(id, updates) {
    await this.simulateDelay();
    const index = this.users.findIndex(u => u.Id === parseInt(id));
    if (index === -1) {
      throw new Error("User not found");
    }
    this.users[index] = { ...this.users[index], ...updates };
    return { ...this.users[index] };
  }

  async delete(id) {
    await this.simulateDelay();
    const index = this.users.findIndex(u => u.Id === parseInt(id));
    if (index === -1) {
      throw new Error("User not found");
    }
    this.users.splice(index, 1);
    return true;
  }

  async suspendUser(id) {
    return this.update(id, { status: "suspended" });
  }

  async activateUser(id) {
    return this.update(id, { status: "active" });
  }

  simulateDelay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export default new UserService();