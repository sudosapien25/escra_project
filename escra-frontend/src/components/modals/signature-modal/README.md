# Signature Modal Module

A comprehensive React TypeScript signature modal component with drawing, typing, and upload capabilities. This module is organized for easy integration into any React project.

## 📁 Module Structure

```
src/modules/signature-modal/
├── index.ts                    # Main exports
├── SignatureModal.tsx          # Main signature modal component
├── integration-code.tsx        # Integration examples and hooks
├── example.tsx                 # Usage examples
├── package.json               # Module dependencies
├── README.md                  # This documentation
├── components/                # Additional signature components
│   └── document-signing-signature-field.tsx
└── packages/                  # Advanced signature packages
    ├── lib/
    ├── signature-pad/
    └── signing/
```

## 🚀 Quick Start

### Installation

The module is already included in your project. To use it:

```tsx
import { SignatureModal, useSignatureModal, SignatureValue } from '@/modules/signature-modal';
```

### Basic Usage

```tsx
import React, { useState } from 'react';
import { SignatureModal, SignatureValue } from '@/modules/signature-modal';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [signature, setSignature] = useState<SignatureValue | null>(null);

  const handleSave = (signature: SignatureValue) => {
    setSignature(signature);
    setIsOpen(false);
    console.log('Signature saved:', signature);
  };

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>
        Sign Document
      </button>
      
      <SignatureModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={handleSave}
        title="Sign Document"
        confirmText="Confirm Signature"
        cancelText="Cancel"
      />
    </div>
  );
}
```

### Using the Custom Hook

For easier integration, use the provided custom hook:

```tsx
import React from 'react';
import { SignatureModal, useSignatureModal } from '@/modules/signature-modal';

function MyComponent() {
  const {
    showSignatureModal,
    handleOpenSignatureModal,
    handleCloseSignatureModal,
    handleSaveSignature,
  } = useSignatureModal();

  return (
    <div>
      <button onClick={handleOpenSignatureModal}>
        Sign Document
      </button>
      
      <SignatureModal
        isOpen={showSignatureModal}
        onClose={handleCloseSignatureModal}
        onSave={handleSaveSignature}
        drawEnabled={true}
        typeEnabled={true}
        uploadEnabled={true}
        title="Sign Document"
        confirmText="Confirm Signature"
        cancelText="Cancel"
      />
    </div>
  );
}
```

## 📋 Component Props

### SignatureModal Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | `false` | Controls modal visibility |
| `onClose` | `() => void` | - | Called when modal is closed |
| `onSave` | `(signature: SignatureValue) => void` | - | Called when signature is saved |
| `initialValue` | `string` | `''` | Initial signature value |
| `drawEnabled` | `boolean` | `true` | Enable drawing signature |
| `typeEnabled` | `boolean` | `true` | Enable typing signature |
| `uploadEnabled` | `boolean` | `true` | Enable uploading signature |
| `title` | `string` | `"Add Your Signature"` | Modal title |
| `confirmText` | `string` | `"Save"` | Confirm button text |
| `cancelText` | `string` | `"Cancel"` | Cancel button text |

### SignatureValue Type

```tsx
interface SignatureValue {
  type: SignatureType; // 'draw' | 'type' | 'upload'
  value: string;       // Base64 image data or text
}
```

### SignatureType Enum

```tsx
enum SignatureType {
  DRAW = 'draw',
  TYPE = 'type',
  UPLOAD = 'upload',
}
```

## 🎨 Features

### Drawing Mode
- **Canvas-based drawing** with smooth strokes
- **Undo functionality** to remove last stroke
- **Clear canvas** to start over
- **Responsive design** that works on touch devices

### Typing Mode
- **Cursive font support** for realistic signatures
- **Multiple font options** (Avenir, cursive variants)
- **Real-time preview** of typed signature
- **Customizable text input**

### Upload Mode
- **Image file upload** (PNG, JPG, etc.)
- **Drag and drop support**
- **Image validation** and error handling
- **Preview before confirmation**

### General Features
- **Dark mode support** - automatically adapts to system theme
- **Responsive design** - works on mobile and desktop
- **Smooth animations** - Framer Motion for transitions
- **TypeScript support** - fully typed components
- **Accessibility** - keyboard navigation and screen reader support

## 🎯 Advanced Usage

### Custom Validation

```tsx
const handleSave = (signature: SignatureValue) => {
  if (signature.type === 'draw' && signature.value.length < 100) {
    alert('Please draw a more complete signature');
    return;
  }
  
  if (signature.type === 'type' && signature.value.length < 2) {
    alert('Please type a longer signature');
    return;
  }
  
  // Save signature
  setSignature(signature);
};
```

### Integration with Forms

```tsx
import { useForm } from 'react-hook-form';

function FormWithSignature() {
  const { register, handleSubmit, setValue } = useForm();

  const handleSaveSignature = (signature: SignatureValue) => {
    setValue('signature', signature.value);
    setValue('signatureType', signature.type);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SignatureModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={handleSaveSignature}
      />
      {/* Other form fields */}
    </form>
  );
}
```

### Custom Styling

The component uses Tailwind CSS classes. You can customize the appearance by:

1. **Overriding CSS classes** in your global styles
2. **Using CSS custom properties** for theme colors
3. **Wrapping the component** with custom styling

```tsx
// Custom CSS variables for theming
:root {
  --signature-primary: #3b82f6;
  --signature-primary-dark: #2563eb;
}

// Or override Tailwind classes
.signature-modal-custom {
  @apply bg-blue-50 dark:bg-gray-900;
}
```

## 📦 Dependencies

### Required Dependencies
```json
{
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "framer-motion": "^10.0.0",
  "react-icons": "^4.0.0",
  "lucide-react": "^0.263.0"
}
```

### Optional Dependencies
```json
{
  "tailwindcss": "^3.0.0",
  "@types/react": "^18.0.0"
}
```

## 🔧 Configuration

### Tailwind CSS Setup

If you're using Tailwind CSS, ensure these classes are available:

```css
/* Required utility classes */
.primary { @apply text-blue-600; }
.primary-dark { @apply text-blue-700; }
.bg-primary { @apply bg-blue-600; }
.bg-primary-dark { @apply bg-blue-700; }
```

### TypeScript Configuration

The module is fully typed. Ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Modal not opening**: Check that `isOpen` prop is `true`
2. **Canvas not working**: Ensure `drawEnabled={true}`
3. **Styling issues**: Verify Tailwind CSS is properly configured
4. **Type errors**: Install `@types/react` and `@types/react-dom`

### Debug Mode

Enable debug logging by adding a debug prop:

```tsx
<SignatureModal
  // ... other props
  debug={true}
/>
```

## 📝 Examples

See the following files for complete examples:

- `example.tsx` - Basic usage examples
- `integration-code.tsx` - Advanced integration patterns
- `components/document-signing-signature-field.tsx` - Document signing implementation

## 🔗 Related Modules

- **Components**: Additional signature field components
- **Packages**: Advanced signature packages from Documenso
- **Utils**: Utility functions for signature handling

## 📄 License

MIT License - see the main project license for details.

---

**Last Updated**: July 21, 2025  
**Version**: 1.0.0  
**Module**: Signature Modal 