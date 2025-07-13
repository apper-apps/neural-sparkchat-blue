import React from "react";
import Error from "@/components/ui/Error";
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

  // Two-Factor Authentication Methods
  async setup2FA() {
    await this.simulateDelay();
    const secret = this.generateTOTPSecret();
    const qrCode = `otpauth://totp/SparkChat%20Hub?secret=${secret}&issuer=SparkChat%20Hub`;
    return {
      secret,
      qrCode,
      backupUrl: `https://chart.googleapis.com/chart?chs=200x200&chld=M|0&cht=qr&chl=${encodeURIComponent(qrCode)}`
    };
  }

  async verifyTOTP(secret, code) {
    await this.simulateDelay();
    // Simulate TOTP verification - in real implementation, use proper TOTP library
    const isValid = code.length === 6 && /^\d+$/.test(code);
    return {
      valid: isValid,
      timestamp: new Date().toISOString()
    };
  }

  async enable2FA(secret, verificationCode) {
    await this.simulateDelay();
    const verification = await this.verifyTOTP(secret, verificationCode);
    if (!verification.valid) {
      throw new Error("Invalid verification code");
    }
    
    // In real implementation, save to user profile
    return {
      enabled: true,
      enabledAt: new Date().toISOString(),
      secret: secret
    };
  }

  async disable2FA() {
    await this.simulateDelay();
    // In real implementation, remove from user profile
    return {
      enabled: false,
      disabledAt: new Date().toISOString()
    };
  }

  async generateBackupCodes() {
    await this.simulateDelay();
    const codes = [];
    for (let i = 0; i < 8; i++) {
      // Generate 8-character backup codes
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      codes.push(code);
    }
    return codes;
  }

  async get2FAStatus() {
    await this.simulateDelay();
    // In real implementation, fetch from user profile
    return {
      enabled: false,
      hasBackupCodes: false,
      lastUsed: null
    };
  }

  generateTOTPSecret() {
    // Generate base32 secret for TOTP (16 characters)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 16; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
  }

simulateDelay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export default new UserService();