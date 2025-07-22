import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { mockSignatures } from '@/data/mockSignatures';

// JSON file path for additional signatures
const signaturesJsonPath = path.join(process.cwd(), 'src/data/additionalSignatures.json');

export async function POST(request: NextRequest) {
  try {
    const newSignature = await request.json();
    
    // Read existing additional signatures from JSON file
    let additionalSignatures = [];
    try {
      const existingData = await fs.readFile(signaturesJsonPath, 'utf8');
      additionalSignatures = JSON.parse(existingData);
    } catch (error) {
      // File doesn't exist yet, start with empty array
      additionalSignatures = [];
    }
    
    // Add the new signature
    additionalSignatures.push(newSignature);
    
    // Write back to JSON file
    await fs.writeFile(signaturesJsonPath, JSON.stringify(additionalSignatures, null, 2), 'utf8');
    
    return NextResponse.json({ success: true, message: 'Signature request saved successfully' });
  } catch (error) {
    console.error('Error saving signature request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save signature request' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { signatureId, field, value } = await request.json();
    
    // Check if it's an original mock signature or additional signature
    const originalSignature = mockSignatures.find(s => s.id === signatureId);
    
    if (originalSignature) {
      // Handle updating original mock signatures - store updates separately
      const updatesPath = path.join(process.cwd(), 'src/data/signatureUpdates.json');
      let signatureUpdates: Record<string, Record<string, any>> = {};
      
      try {
        const existingUpdates = await fs.readFile(updatesPath, 'utf8');
        signatureUpdates = JSON.parse(existingUpdates);
      } catch (error) {
        // File doesn't exist yet, start with empty object
        signatureUpdates = {};
      }
      
      // Store the update
      if (!signatureUpdates[signatureId]) {
        signatureUpdates[signatureId] = {};
      }
      signatureUpdates[signatureId][field] = value;
      
      // Write back to updates file
      await fs.writeFile(updatesPath, JSON.stringify(signatureUpdates, null, 2), 'utf8');
    } else {
      // Handle updating additional signatures directly
      try {
        const additionalData = await fs.readFile(signaturesJsonPath, 'utf8');
        const additionalSignatures = JSON.parse(additionalData);
        
        const signatureIndex = additionalSignatures.findIndex((s: any) => s.id === signatureId);
        if (signatureIndex !== -1) {
          additionalSignatures[signatureIndex][field] = value;
          await fs.writeFile(signaturesJsonPath, JSON.stringify(additionalSignatures, null, 2), 'utf8');
        }
      } catch (error) {
        throw new Error('Signature request not found');
      }
    }
    
    return NextResponse.json({ success: true, message: 'Signature request updated successfully' });
  } catch (error) {
    console.error('Error updating signature request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update signature request' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Start with the original mock signatures
    let allSignatures = [...mockSignatures];
    
    // Apply any updates to original signatures
    const updatesPath = path.join(process.cwd(), 'src/data/signatureUpdates.json');
    try {
      const updatesData = await fs.readFile(updatesPath, 'utf8');
      const signatureUpdates = JSON.parse(updatesData);
      
      allSignatures = allSignatures.map(signature => {
        if (signatureUpdates[signature.id]) {
          return { ...signature, ...signatureUpdates[signature.id] };
        }
        return signature;
      }).filter(signature => !signatureUpdates[signature.id]?.deleted);
    } catch (error) {
      // No updates file exists yet
    }
    
    // Add any additional signatures from JSON file
    try {
      const additionalData = await fs.readFile(signaturesJsonPath, 'utf8');
      const additionalSignatures = JSON.parse(additionalData);
      allSignatures = [...allSignatures, ...additionalSignatures];
    } catch (error) {
      // File doesn't exist yet, just use mock signatures
    }
    
    return NextResponse.json({ signatures: allSignatures });
  } catch (error) {
    console.error('Error loading signatures:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load signatures' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { signatureId } = await request.json();
    
    // Check if it's an original mock signature or additional signature
    const originalSignature = mockSignatures.find(s => s.id === signatureId);
    
    if (originalSignature) {
      // For original mock signatures, we can't delete them permanently
      // Instead, we'll mark them as deleted in the updates file
      const updatesPath = path.join(process.cwd(), 'src/data/signatureUpdates.json');
      let signatureUpdates: Record<string, Record<string, any>> = {};
      
      try {
        const existingUpdates = await fs.readFile(updatesPath, 'utf8');
        signatureUpdates = JSON.parse(existingUpdates);
      } catch (error) {
        // File doesn't exist yet, start with empty object
        signatureUpdates = {};
      }
      
      // Mark the signature as deleted
      if (!signatureUpdates[signatureId]) {
        signatureUpdates[signatureId] = {};
      }
      signatureUpdates[signatureId].deleted = true;
      
      // Write back to updates file
      await fs.writeFile(updatesPath, JSON.stringify(signatureUpdates, null, 2), 'utf8');
    } else {
      // Handle deleting additional signatures directly
      try {
        const additionalData = await fs.readFile(signaturesJsonPath, 'utf8');
        const additionalSignatures = JSON.parse(additionalData);
        
        const signatureIndex = additionalSignatures.findIndex((s: any) => s.id === signatureId);
        if (signatureIndex !== -1) {
          additionalSignatures.splice(signatureIndex, 1);
          await fs.writeFile(signaturesJsonPath, JSON.stringify(additionalSignatures, null, 2), 'utf8');
        } else {
          throw new Error('Signature request not found');
        }
      } catch (error) {
        throw new Error('Signature request not found');
      }
    }
    
    return NextResponse.json({ success: true, message: 'Signature request deleted successfully' });
  } catch (error) {
    console.error('Error deleting signature request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete signature request' },
      { status: 500 }
    );
  }
} 