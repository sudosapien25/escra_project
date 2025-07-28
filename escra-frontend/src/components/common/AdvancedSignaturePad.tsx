import React, { useState, useRef, useMemo } from 'react';
import { Undo2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
export type DocumentSignatureType = 'draw' | 'type' | 'upload';

export type SignaturePadValue = {
  type: DocumentSignatureType;
  value: string;
};

export interface AdvancedSignaturePadProps {
  value?: string;
  onChange?: (_value: SignaturePadValue) => void;
  disabled?: boolean;
  typedSignatureEnabled?: boolean;
  uploadSignatureEnabled?: boolean;
  drawSignatureEnabled?: boolean;
  onValidityChange?: (isValid: boolean) => void;
}

// Constants
const SIGNATURE_CANVAS_DPI = 2;
const SIGNATURE_MIN_COVERAGE_THRESHOLD = 0.01;

// Utility functions
const average = (a: number, b: number) => (a + b) / 2;

const getSvgPathFromStroke = (points: number[][], closed = true) => {
  const len = points.length;
  if (len < 4) return '';

  let a = points[0];
  let b = points[1];
  const c = points[2];

  let result = `M${a[0].toFixed(2)},${a[1].toFixed(2)} Q${b[0].toFixed(2)},${b[1].toFixed(2)} ${average(b[0], c[0]).toFixed(2)},${average(b[1], c[1]).toFixed(2)} T`;

  for (let i = 2, max = len - 1; i < max; i++) {
    a = points[i];
    b = points[i + 1];
    result += `${average(a[0], b[0]).toFixed(2)},${average(a[1], b[1]).toFixed(2)} `;
  }

  if (closed) {
    result += 'Z';
  }

  return result;
};

const isBase64Image = (value: string) => value.startsWith('data:image/png;base64,');

// Point class for drawing
interface PointLike {
  x: number;
  y: number;
  timestamp: number;
}

class Point implements PointLike {
  public x: number;
  public y: number;
  public timestamp: number;

  constructor(x: number, y: number, timestamp?: number) {
    this.x = x;
    this.y = y;
    this.timestamp = timestamp ?? Date.now();
  }

  public static fromEvent(
    event: React.MouseEvent | React.PointerEvent | React.TouchEvent,
    dpi = 1,
    el?: HTMLElement | null,
  ): Point {
    const target = el ?? event.target;
    if (!(target instanceof HTMLElement)) {
      throw new Error('Event target is not an HTMLElement.');
    }

    const { top, bottom, left, right } = target.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    let x = Math.min(Math.max(left, clientX), right) - left;
    let y = Math.min(Math.max(top, clientY), bottom) - top;

    x *= dpi;
    y *= dpi;

    return new Point(x, y);
  }

  public distanceTo(point: Point): number {
    const dx = this.x - point.x;
    const dy = this.y - point.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

// Simple stroke function
const getStroke = (points: Point[], options: any) => {
  if (points.length < 2) return [];
  
  const result: number[][] = [];
  
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    result.push([point.x, point.y]);
  }
  
  return result;
};

// Color Picker Component
interface ColorPickerProps {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, setSelectedColor }) => {
  const colors = [
    { name: 'Black', value: 'black', class: 'bg-black' },
    { name: 'White', value: 'white', class: 'bg-white border border-gray-300' },
  ];

  return (
    <div className="absolute top-3 right-3 flex gap-2">
      {colors.map((color) => (
        <button
          key={color.value}
          onClick={() => setSelectedColor(color.value)}
          className={cn(
            'w-6 h-6 rounded-full border-2 transition-all',
            color.class,
            selectedColor === color.value
              ? 'border-primary ring-2 ring-primary ring-offset-2'
              : 'border-gray-300 hover:border-gray-400'
          )}
          title={color.name}
        />
      ))}
    </div>
  );
};

// Drawing Component
interface DrawComponentProps {
  value: string;
  onChange: (value: string) => void;
}

const DrawComponent: React.FC<DrawComponentProps> = ({ value, onChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [lines, setLines] = useState<Point[][]>([]);
  const [currentLine, setCurrentLine] = useState<Point[]>([]);
  const [selectedColor, setSelectedColor] = useState('black');

  const onMouseDown = (event: React.MouseEvent | React.PointerEvent | React.TouchEvent) => {
    if (event.cancelable) event.preventDefault();
    setIsPressed(true);
    const point = Point.fromEvent(event, SIGNATURE_CANVAS_DPI, canvasRef.current);
    setCurrentLine([point]);
  };

  const onMouseMove = (event: React.MouseEvent | React.PointerEvent | React.TouchEvent) => {
    if (event.cancelable) event.preventDefault();
    if (!isPressed) return;

    const point = Point.fromEvent(event, SIGNATURE_CANVAS_DPI, canvasRef.current);
    setCurrentLine(prev => [...prev, point]);
  };

  const onMouseUp = () => {
    if (!isPressed) return;
    setIsPressed(false);
    
    if (currentLine.length > 0) {
      setLines(prev => [...prev, currentLine]);
      setCurrentLine([]);
    }
  };

  const clearCanvas = () => {
    setLines([]);
    setCurrentLine([]);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  const undo = () => {
    setLines(prev => prev.slice(0, -1));
  };

  // Convert lines to data URL
  React.useEffect(() => {
    if (lines.length === 0) {
      onChange('');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = selectedColor === 'white' ? '#ffffff' : '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    lines.forEach(line => {
      if (line.length < 2) return;
      
      ctx.beginPath();
      ctx.moveTo(line[0].x, line[0].y);
      
      for (let i = 1; i < line.length; i++) {
        ctx.lineTo(line[i].x, line[i].y);
      }
      
      ctx.stroke();
    });

    const dataUrl = canvas.toDataURL('image/png');
    onChange(dataUrl);
  }, [lines, onChange, selectedColor]);

  return (
    <div className="relative h-full w-full">
      <canvas
        ref={canvasRef}
        width={400 * SIGNATURE_CANVAS_DPI}
        height={200 * SIGNATURE_CANVAS_DPI}
        style={{
          width: '400px',
          height: '200px',
          border: '2px solid #e5e7eb',
          borderRadius: '8px',
          cursor: 'crosshair',
          backgroundColor: '#ffffff',
          backgroundImage: 'radial-gradient(circle at 1px 1px, #f3f4f6 1px, transparent 0)',
          backgroundSize: '20px 20px',
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onMouseDown}
        onTouchMove={onMouseMove}
        onTouchEnd={onMouseUp}
      />
      
      <ColorPicker selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
      
      <div className="absolute bottom-2 right-2 flex gap-2">
        <button
          onClick={undo}
          disabled={lines.length === 0}
          className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
        >
          Undo
        </button>
        <button
          onClick={clearCanvas}
          className="px-3 py-1 text-sm bg-red-500 text-white hover:bg-red-600 rounded"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

// Type Component
interface TypeComponentProps {
  value: string;
  onChange: (value: string) => void;
}

const TypeComponent: React.FC<TypeComponentProps> = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState(value);

  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <input
          placeholder="Type your signature"
          className="w-full bg-transparent px-4 py-2 text-center text-2xl text-gray-700 dark:text-gray-300 placeholder:text-lg placeholder:text-gray-400 focus:outline-none border-b-2 border-gray-300 dark:border-gray-600 focus:border-primary transition-colors"
          value={inputValue}
          onChange={handleInputChange}
          style={{
            fontFamily: '"Dancing Script", "Great Vibes", "Alex Brush", "Brush Script MT", "Lucida Handwriting", cursive'
          }}
        />
        
        <div className="mt-6 p-4 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 min-h-[120px] flex items-center justify-center">
          {inputValue ? (
            <div 
              className="text-3xl text-gray-900 dark:text-white text-center"
              style={{
                fontFamily: '"Dancing Script", "Great Vibes", "Alex Brush", "Brush Script MT", "Lucida Handwriting", cursive'
              }}
            >
              {inputValue}
            </div>
          ) : (
            <div className="text-gray-400 dark:text-gray-500 text-center">
              <div className="text-sm mb-2">Signature Preview</div>
              <div className="text-lg" style={{ fontFamily: '"Dancing Script", "Great Vibes", "Alex Brush", "Brush Script MT", "Lucida Handwriting", cursive' }}>
                Your signature will appear here
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Upload Component
interface UploadComponentProps {
  value: string;
  onChange: (value: string) => void;
}

const UploadComponent: React.FC<UploadComponentProps> = ({ value, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onChange(result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4">
      {value ? (
        <div className="relative">
          <img src={value} alt="Signature" className="max-h-32 max-w-full" />
          <button
            onClick={() => onChange('')}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-sm"
          >
            ×
          </button>
        </div>
      ) : (
        <div className="text-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
          >
            Upload Signature
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};

// Main Component
export const AdvancedSignaturePad: React.FC<AdvancedSignaturePadProps> = ({
  value = '',
  onChange,
  disabled = false,
  typedSignatureEnabled = true,
  uploadSignatureEnabled = true,
  drawSignatureEnabled = true,
}) => {
  const [imageSignature, setImageSignature] = useState(isBase64Image(value) ? value : '');
  const [drawSignature, setDrawSignature] = useState(isBase64Image(value) ? value : '');
  const [typedSignature, setTypedSignature] = useState(isBase64Image(value) ? '' : value);

  const [tab, setTab] = useState<'draw' | 'text' | 'image'>(() => {
    if (drawSignatureEnabled && drawSignature) return 'draw';
    if (typedSignatureEnabled && typedSignature) return 'text';
    if (uploadSignatureEnabled && imageSignature) return 'image';
    if (drawSignatureEnabled) return 'draw';
    if (typedSignatureEnabled) return 'text';
    if (uploadSignatureEnabled) return 'image';
    return 'draw';
  });

  const onImageSignatureChange = (value: string) => {
    setImageSignature(value);
    onChange?.({ type: 'upload', value });
  };

  const onDrawSignatureChange = (value: string) => {
    setDrawSignature(value);
    onChange?.({ type: 'draw', value });
  };

  const onTypedSignatureChange = (value: string) => {
    setTypedSignature(value);
    onChange?.({ type: 'type', value });
  };

  const onTabChange = (value: 'draw' | 'text' | 'image') => {
    if (disabled) return;
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
    <div className="w-full">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
        {drawSignatureEnabled && (
          <button
            onClick={() => onTabChange('draw')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors",
              tab === 'draw'
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            )}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Draw
          </button>
        )}

        {typedSignatureEnabled && (
          <button
            onClick={() => onTabChange('text')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors",
              tab === 'text'
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            )}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Type
          </button>
        )}

        {uploadSignatureEnabled && (
          <button
            onClick={() => onTabChange('image')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors",
              tab === 'image'
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            )}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload
          </button>
        )}
      </div>

      {/* Content */}
      <div className="h-64 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
        {tab === 'draw' && (
          <DrawComponent value={drawSignature} onChange={onDrawSignatureChange} />
        )}
        {tab === 'text' && (
          <TypeComponent value={typedSignature} onChange={onTypedSignatureChange} />
        )}
        {tab === 'image' && (
          <UploadComponent value={imageSignature} onChange={onImageSignatureChange} />
        )}
      </div>
    </div>
  );
}; 