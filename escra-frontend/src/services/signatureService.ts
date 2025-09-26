import { signatureApi, SignatureFilters } from './api/signatureApi';
import { SignatureRequest } from '@/types/signature';

export class SignatureService {
  static async getSignatures(filters?: SignatureFilters) {
    const response = await signatureApi.getSignatures(filters);
    return response.signatures;
  }

  static async getSignature(id: string) {
    return await signatureApi.getSignature(id);
  }

  static async requestSignature(data: SignatureRequest) {
    return await signatureApi.requestSignature(data);
  }

  static async cancelSignature(id: string) {
    return await signatureApi.cancelSignature(id);
  }

  static async voidSignature(id: string) {
    return await signatureApi.voidSignature(id);
  }

  static async getSignaturesByContract(contractId: string) {
    return await signatureApi.getSignaturesByContract(contractId);
  }
}