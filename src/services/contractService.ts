import { mockContracts } from '../data/mockContracts';

export class ContractService {
  static async getContracts() {
    return mockContracts;
  }

  static async getContract(id: string) {
    const contract = mockContracts.find(c => c.id === id);
    if (!contract) {
      throw new Error('Contract not found');
    }
    return contract;
  }

  static async createContract(contractData: any) {
    const newContract = {
      id: `CNT-${Date.now().toString().slice(-6)}`,
      ...contractData
    };
    return newContract;
  }

  static async updateContract(id: string, updates: any) {
    const contract = mockContracts.find(c => c.id === id);
    if (!contract) {
      throw new Error('Contract not found');
    }
    return { ...contract, ...updates };
  }

  static async deleteContract(id: string) {
    // Mock implementation
    return;
  }
} 