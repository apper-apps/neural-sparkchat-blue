import invoicesData from "@/services/mockData/invoices.json";

class BillingService {
  constructor() {
    this.invoices = [...invoicesData];
  }

  async getInvoices() {
    await this.simulateDelay();
    return [...this.invoices];
  }

  async getInvoiceById(id) {
    await this.simulateDelay();
    const invoice = this.invoices.find(i => i.Id === parseInt(id));
    if (!invoice) {
      throw new Error("Invoice not found");
    }
    return { ...invoice };
  }

  async createInvoice(invoiceData) {
    await this.simulateDelay();
    const newInvoice = {
      Id: Math.max(...this.invoices.map(i => i.Id)) + 1,
      ...invoiceData,
      stripeInvoiceId: `in_${Date.now()}${Math.random().toString(36).substr(2, 5)}`
    };
    this.invoices.push(newInvoice);
    return { ...newInvoice };
  }

  async updateInvoice(id, updates) {
    await this.simulateDelay();
    const index = this.invoices.findIndex(i => i.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Invoice not found");
    }
    this.invoices[index] = { ...this.invoices[index], ...updates };
    return { ...this.invoices[index] };
  }

  simulateDelay() {
    return new Promise(resolve => setTimeout(resolve, 400));
  }
}

export default new BillingService();