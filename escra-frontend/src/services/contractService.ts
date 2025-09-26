import { contractApi, ContractFilters, CreateContractData, UpdateContractData } from './api/contractApi';

export class ContractService {
  static async getContracts(filters?: ContractFilters) {
    const response = await contractApi.getContracts(filters);
    return response.contracts;
  }

  static async getContract(id: string) {
    return await contractApi.getContract(id);
  }

  static async createContract(contractData: CreateContractData) {
    return await contractApi.createContract(contractData);
  }

  static async updateContract(id: string, updates: UpdateContractData) {
    return await contractApi.updateContract(id, updates);
  }

  static async deleteContract(id: string) {
    return await contractApi.deleteContract(id);
  }

  static async searchContracts(query: string) {
    return await contractApi.searchContracts(query);
  }
} 