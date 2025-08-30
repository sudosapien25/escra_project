import Cookies from 'js-cookie';
import { ContractService } from './contractService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface SignatureDocument {
  id: string;
  documentName: string;
  signerName: string;
  signerEmail: string;
  status: 'pending' | 'signed' | 'rejected' | 'expired';
  sentDate: string;
  signedDate?: string;
  contractId?: string;
}

export class SignatureService {
  private static getAuthHeaders(): HeadersInit {
    const token = Cookies.get('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  }

  static async getAllSignatures(): Promise<SignatureDocument[]> {
    try {
      // First, get all contracts
      const contractsResponse = await ContractService.getContracts({ limit: 100 });
      const contracts = contractsResponse.contracts;
      
      const signatures: SignatureDocument[] = [];
      
      // For each contract, check if it has signatures or is in signature status
      for (const contract of contracts) {
        // Fetch full contract details to get signature data
        const fullContract = await ContractService.getContract(contract.id);
        
        // If contract has signatures field, process them
        if (fullContract.signatures && fullContract.signatures.length > 0) {
          fullContract.signatures.forEach((sig: any) => {
            signatures.push({
              id: sig.id || `SIG-${contract.id}-${Date.now()}`,
              documentName: contract.title,
              signerName: sig.party || 'Unknown',
              signerEmail: sig.partyId || '',
              status: sig.status as 'pending' | 'signed' | 'rejected' | 'expired',
              sentDate: sig.signedAt || fullContract.createdAt || new Date().toISOString(),
              signedDate: sig.signedAt,
              contractId: contract.id
            });
          });
        } else if (contract.status === 'Signatures' || contract.status === 'Pending Signatures') {
          // Create pending signature entries for contracts in signature phase
          const parties = [
            { name: fullContract.buyer || 'Buyer', email: fullContract.buyerEmail || '' },
            { name: fullContract.seller || 'Seller', email: fullContract.sellerEmail || '' }
          ];
          
          if (fullContract.agent) {
            parties.push({ name: fullContract.agent, email: fullContract.agentEmail || '' });
          }
          
          parties.forEach((party, index) => {
            signatures.push({
              id: `SIG-${contract.id}-${index}`,
              documentName: contract.title,
              signerName: party.name,
              signerEmail: party.email,
              status: 'pending',
              sentDate: fullContract.updatedAt || fullContract.createdAt || new Date().toISOString(),
              contractId: contract.id
            });
          });
        }
      }
      
      // Sort by sent date (most recent first)
      signatures.sort((a, b) => {
        const dateA = new Date(a.sentDate).getTime();
        const dateB = new Date(b.sentDate).getTime();
        return dateB - dateA;
      });
      
      return signatures;
    } catch (error) {
      console.error('Failed to fetch signatures:', error);
      return [];
    }
  }

  static async updateSignatureStatus(signatureId: string, status: 'signed' | 'rejected'): Promise<boolean> {
    try {
      // Extract contract ID from signature ID (format: SIG-{contractId}-{index})
      const parts = signatureId.split('-');
      if (parts.length < 3) return false;
      
      const contractId = parts[1];
      
      // Update the contract status if all signatures are complete
      if (status === 'signed') {
        // You might want to check if all signatures are complete before moving to next stage
        await ContractService.updateContractStatus(contractId, 'Funds Disbursed', 'All signatures completed');
      }
      
      return true;
    } catch (error) {
      console.error('Failed to update signature status:', error);
      return false;
    }
  }

  static async createSignatureRequest(contractId: string, signerEmail: string, signerName: string): Promise<SignatureDocument | null> {
    try {
      const contract = await ContractService.getContract(contractId);
      
      const signature: SignatureDocument = {
        id: `SIG-${contractId}-${Date.now()}`,
        documentName: contract.title,
        signerName,
        signerEmail,
        status: 'pending',
        sentDate: new Date().toISOString(),
        contractId
      };
      
      // In a real implementation, this would create the signature request on the server
      // For now, we'll just return the created signature
      return signature;
    } catch (error) {
      console.error('Failed to create signature request:', error);
      return null;
    }
  }
}