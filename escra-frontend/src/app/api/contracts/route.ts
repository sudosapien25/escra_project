import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { mockContracts } from '@/data/mockContracts';

// JSON file path for additional contracts
const contractsJsonPath = path.join(process.cwd(), 'src/data/additionalContracts.json');

export async function POST(request: NextRequest) {
  try {
    const newContract = await request.json();
    
    // Read existing additional contracts from JSON file
    let additionalContracts = [];
    try {
      const existingData = await fs.readFile(contractsJsonPath, 'utf8');
      additionalContracts = JSON.parse(existingData);
    } catch (error) {
      // File doesn't exist yet, start with empty array
      additionalContracts = [];
    }
    
    // Add the new contract
    additionalContracts.push(newContract);
    
    // Write back to JSON file
    await fs.writeFile(contractsJsonPath, JSON.stringify(additionalContracts, null, 2), 'utf8');
    
    return NextResponse.json({ success: true, message: 'Contract saved successfully' });
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
    const { contractId, field, value } = await request.json();
    
    // Check if it's an original mock contract or additional contract
    const originalContract = mockContracts.find(c => c.id === contractId);
    
    if (originalContract) {
      // Handle updating original mock contracts - store updates separately
      const updatesPath = path.join(process.cwd(), 'src/data/contractUpdates.json');
      let contractUpdates: Record<string, Record<string, any>> = {};
      
      try {
        const existingUpdates = await fs.readFile(updatesPath, 'utf8');
        contractUpdates = JSON.parse(existingUpdates);
      } catch (error) {
        // File doesn't exist yet, start with empty object
        contractUpdates = {};
      }
      
      // Store the update
      if (!contractUpdates[contractId]) {
        contractUpdates[contractId] = {};
      }
      contractUpdates[contractId][field] = value;
      
      // Write back to updates file
      await fs.writeFile(updatesPath, JSON.stringify(contractUpdates, null, 2), 'utf8');
    } else {
      // Handle updating additional contracts directly
      try {
        const additionalData = await fs.readFile(contractsJsonPath, 'utf8');
        const additionalContracts = JSON.parse(additionalData);
        
        const contractIndex = additionalContracts.findIndex((c: any) => c.id === contractId);
        if (contractIndex !== -1) {
          additionalContracts[contractIndex][field] = value;
          await fs.writeFile(contractsJsonPath, JSON.stringify(additionalContracts, null, 2), 'utf8');
        }
      } catch (error) {
        throw new Error('Contract not found');
      }
    }
    
    return NextResponse.json({ success: true, message: 'Contract updated successfully' });
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
    // Start with the original mock contracts
    let allContracts = [...mockContracts];
    
    // Apply any updates to original contracts
    const updatesPath = path.join(process.cwd(), 'src/data/contractUpdates.json');
    try {
      const updatesData = await fs.readFile(updatesPath, 'utf8');
      const contractUpdates = JSON.parse(updatesData);
      
      allContracts = allContracts.map(contract => {
        if (contractUpdates[contract.id]) {
          return { ...contract, ...contractUpdates[contract.id] };
        }
        return contract;
      }).filter(contract => !contractUpdates[contract.id]?.deleted);
    } catch (error) {
      // No updates file exists yet
    }
    
    // Add any additional contracts from JSON file
    try {
      const additionalData = await fs.readFile(contractsJsonPath, 'utf8');
      const additionalContracts = JSON.parse(additionalData);
      allContracts = [...allContracts, ...additionalContracts];
    } catch (error) {
      // File doesn't exist yet, just use mock contracts
    }
    
    return NextResponse.json({ contracts: allContracts });
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
    
    // Check if it's an original mock contract or additional contract
    const originalContract = mockContracts.find(c => c.id === contractId);
    
    if (originalContract) {
      // For original mock contracts, we can't delete them permanently
      // Instead, we'll mark them as deleted in the updates file
      const updatesPath = path.join(process.cwd(), 'src/data/contractUpdates.json');
      let contractUpdates: Record<string, Record<string, any>> = {};
      
      try {
        const existingUpdates = await fs.readFile(updatesPath, 'utf8');
        contractUpdates = JSON.parse(existingUpdates);
      } catch (error) {
        // File doesn't exist yet, start with empty object
        contractUpdates = {};
      }
      
      // Mark the contract as deleted
      if (!contractUpdates[contractId]) {
        contractUpdates[contractId] = {};
      }
      contractUpdates[contractId].deleted = true;
      
      // Write back to updates file
      await fs.writeFile(updatesPath, JSON.stringify(contractUpdates, null, 2), 'utf8');
    } else {
      // Handle deleting additional contracts directly
      try {
        const additionalData = await fs.readFile(contractsJsonPath, 'utf8');
        const additionalContracts = JSON.parse(additionalData);
        
        const contractIndex = additionalContracts.findIndex((c: any) => c.id === contractId);
        if (contractIndex !== -1) {
          additionalContracts.splice(contractIndex, 1);
          await fs.writeFile(contractsJsonPath, JSON.stringify(additionalContracts, null, 2), 'utf8');
        } else {
          throw new Error('Contract not found');
        }
      } catch (error) {
        throw new Error('Contract not found');
      }
    }
    
    return NextResponse.json({ success: true, message: 'Contract deleted successfully' });
  } catch (error) {
    console.error('Error deleting contract:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete contract' },
      { status: 500 }
    );
  }
} 