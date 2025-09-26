import { NextRequest, NextResponse } from 'next/server';
import { SignatureService } from '@/services/signatureService';

export async function POST(request: NextRequest) {
  try {
    const signatureData = await request.json();
    const newSignature = await SignatureService.requestSignature(signatureData);
    return NextResponse.json({ success: true, signature: newSignature, message: 'Signature request saved successfully' });
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
    const { signatureId, field, value, ...updates } = await request.json();

    const updateData = field ? { [field]: value } : updates;

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
    const signatures = await SignatureService.getSignatures();
    return NextResponse.json({ signatures });
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
    await SignatureService.cancelSignature(signatureId);
    return NextResponse.json({ success: true, message: 'Signature request deleted successfully' });
  } catch (error) {
    console.error('Error deleting signature request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete signature request' },
      { status: 500 }
    );
  }
} 