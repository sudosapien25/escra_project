import { NextRequest, NextResponse } from 'next/server';
import { ContractService } from '@/services/contractService';

export async function POST(request: NextRequest) {
  try {
    const contractData = await request.json();
    const newContract = await ContractService.createContract(contractData);
    return NextResponse.json({ success: true, contract: newContract, message: 'Contract saved successfully' });
  } catch (error) {
    console.error('Error saving contract:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save contract' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { contractId, field, value, ...updates } = await request.json();

    const updateData = field ? { [field]: value } : updates;
    const updatedContract = await ContractService.updateContract(contractId, updateData);

    return NextResponse.json({ success: true, contract: updatedContract, message: 'Contract updated successfully' });
  } catch (error) {
    console.error('Error updating contract:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update contract' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const contracts = await ContractService.getContracts();
    return NextResponse.json({ contracts });
  } catch (error) {
    console.error('Error loading contracts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load contracts' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { contractId } = await request.json();
    await ContractService.deleteContract(contractId);
    return NextResponse.json({ success: true, message: 'Contract deleted successfully' });
  } catch (error) {
    console.error('Error deleting contract:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete contract' },
      { status: 500 }
    );
  }
} 