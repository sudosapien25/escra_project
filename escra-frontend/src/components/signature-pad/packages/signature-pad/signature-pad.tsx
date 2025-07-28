import type { HTMLAttributes } from 'react';
import { useState } from 'react';

import { KeyboardIcon, UploadCloudIcon } from 'lucide-react';

import { cn } from '../../../../lib/utils';
import { SignaturePadDraw } from './signature-pad-draw';
import { SignaturePadType } from './signature-pad-type';
import { SignaturePadUpload } from './signature-pad-upload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './signature-tabs';

export type DocumentSignatureType = 'draw' | 'type' | 'upload';

export type SignaturePadValue = {
  type: DocumentSignatureType;
  value: string;
};

export type SignaturePadProps = Omit<HTMLAttributes<HTMLCanvasElement>, 'onChange'> & {
  value?: string;
  onChange?: (_value: SignaturePadValue) => void;

  disabled?: boolean;

  typedSignatureEnabled?: boolean;
  uploadSignatureEnabled?: boolean;
  drawSignatureEnabled?: boolean;

  onValidityChange?: (isValid: boolean) => void;
};

export const SignaturePad = ({
  value = '',
  onChange,
  disabled = false,
  typedSignatureEnabled = true,
  uploadSignatureEnabled = true,
  drawSignatureEnabled = true,
}: SignaturePadProps) => {
  const [imageSignature, setImageSignature] = useState(isBase64Image(value) ? value : '');
  const [drawSignature, setDrawSignature] = useState(isBase64Image(value) ? value : '');
  const [typedSignature, setTypedSignature] = useState(isBase64Image(value) ? '' : value);

  /**
   * Get the first enabled tab that has a signature if possible, otherwise just get
   * the first enabled tab.
   */
  const [tab, setTab] = useState(
    ((): 'draw' | 'text' | 'image' => {
      // First passthrough to check to see if there's a signature for a given tab.
      if (drawSignatureEnabled && drawSignature) {
        return 'draw';
      }

      if (typedSignatureEnabled && typedSignature) {
        return 'text';
      }

      if (uploadSignatureEnabled && imageSignature) {
        return 'image';
      }

      // Second passthrough to just select the first avaliable tab.
      if (drawSignatureEnabled) {
        return 'draw';
      }

      if (typedSignatureEnabled) {
        return 'text';
      }

      if (uploadSignatureEnabled) {
        return 'image';
      }

      throw new Error('No signature enabled');
    })(),
  );

  const onImageSignatureChange = (value: string) => {
    setImageSignature(value);

    onChange?.({
      type: 'upload' as DocumentSignatureType,
      value,
    });
  };

  const onDrawSignatureChange = (value: string) => {
    setDrawSignature(value);

    onChange?.({
      type: 'draw' as DocumentSignatureType,
      value,
    });
  };

  const onTypedSignatureChange = (value: string) => {
    setTypedSignature(value);

    onChange?.({
      type: 'type' as DocumentSignatureType,
      value,
    });
  };

  const onTabChange = (value: 'draw' | 'text' | 'image') => {
    if (disabled) {
      return;
    }

    setTab(value);

    switch (value) {
      case 'draw':
        onDrawSignatureChange(drawSignature);
        break;
      case 'text':
        onTypedSignatureChange(typedSignature);
        break;
      case 'image':
        onImageSignatureChange(imageSignature);
        break;
    }
  };

  if (!drawSignatureEnabled && !typedSignatureEnabled && !uploadSignatureEnabled) {
    return null;
  }

  return (
    <Tabs
      defaultValue={tab}
      className={cn({
        'pointer-events-none': disabled,
      })}
      onValueChange={(value: string) => onTabChange(value as 'draw' | 'text' | 'image')}
    >
      <TabsList>
        {drawSignatureEnabled && (
          <TabsTrigger value="draw">
            <svg className="mr-2 size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Draw
          </TabsTrigger>
        )}

        {typedSignatureEnabled && (
          <TabsTrigger value="text">
            <KeyboardIcon className="mr-2 size-4" />
            Type
          </TabsTrigger>
        )}

        {uploadSignatureEnabled && (
          <TabsTrigger value="image">
            <UploadCloudIcon className="mr-2 size-4" />
            Upload
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent
        value="draw"
        className="border-border aspect-signature-pad dark:bg-background relative flex items-center justify-center rounded-md border bg-neutral-50 text-center"
      >
        <SignaturePadDraw
          className="h-full w-full"
          onChange={onDrawSignatureChange}
          value={drawSignature}
        />
      </TabsContent>

      <TabsContent
        value="text"
        className="border-border aspect-signature-pad dark:bg-background relative flex items-center justify-center rounded-md border bg-neutral-50 text-center"
      >
        <SignaturePadType value={typedSignature} onChange={onTypedSignatureChange} />
      </TabsContent>

      <TabsContent
        value="image"
        className={cn(
          'border-border aspect-signature-pad dark:bg-background relative rounded-md border bg-neutral-50',
          {
            'bg-white': imageSignature,
          },
        )}
      >
        <SignaturePadUpload value={imageSignature} onChange={onImageSignatureChange} />
      </TabsContent>
    </Tabs>
  );
};

// Utility function
const isBase64Image = (value: string) => value.startsWith('data:image/png;base64,'); 