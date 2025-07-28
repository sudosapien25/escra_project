import React, { useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LuPen, LuType } from 'react-icons/lu';
import { HiOutlineUpload } from 'react-icons/hi';

// Types
export enum SignatureType {
  DRAW = 'draw',
  TYPE = 'type',
  UPLOAD = 'upload',
}

export interface SignatureValue {
  type: SignatureType;
  value: string;
}

export interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signature: SignatureValue) => void;
  initialValue?: string;
  drawEnabled?: boolean;
  typeEnabled?: boolean;
  uploadEnabled?: boolean;
  title?: string;
  confirmText?: string;
  cancelText?: string;
}

// Constants
const SIGNATURE_CANVAS_DPI = 2;
const SIGNATURE_MIN_COVERAGE_THRESHOLD = 0.01;

const isBase64Image = (value: string) => value.startsWith('data:image/png;base64,');

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
}

// Drawing component
interface SignaturePadDrawProps {
  value: string;
  onChange: (value: string) => void;
}

const SignaturePadDraw: React.FC<SignaturePadDrawProps> = ({ value, onChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [lines, setLines] = useState<Point[][]>([]);
  const [currentLine, setCurrentLine] = useState<Point[]>([]);

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

  // Convert lines to SVG and then to data URL
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
    
    // Set stroke color: black for light mode, white for dark mode
    const isDarkMode = document.documentElement.classList.contains('dark');
    ctx.strokeStyle = isDarkMode ? '#ffffff' : '#000000';
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

    // Convert to data URL
    const dataUrl = canvas.toDataURL('image/png');
    onChange(dataUrl);
  }, [lines, onChange]);

  return (
    <div className="relative h-full w-full">
      <canvas
        ref={canvasRef}
        width={400 * SIGNATURE_CANVAS_DPI}
        height={200 * SIGNATURE_CANVAS_DPI}
        className="border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
        style={{
          width: '400px',
          height: '200px',
          cursor: 'crosshair',
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onMouseDown}
        onTouchMove={onMouseMove}
        onTouchEnd={onMouseUp}
      />
      <div className="absolute bottom-4 right-0 flex gap-1">
        <button
          onClick={undo}
          disabled={lines.length === 0}
          className="px-3 py-1 text-xs font-semibold bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
          style={{ fontFamily: 'Avenir, sans-serif' }}
        >
          Undo
        </button>
        <button
          onClick={clearCanvas}
          className="px-3 py-1 text-xs font-semibold bg-red-500 text-white hover:bg-red-600 rounded"
          style={{ fontFamily: 'Avenir, sans-serif' }}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

// Type component
interface SignaturePadTypeProps {
  value: string;
  onChange: (value: string) => void;
}

const SignaturePadType: React.FC<SignaturePadTypeProps> = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState(value);

  // Sync with parent component value
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
        {/* Input field */}
        <input
          placeholder="Type your signature"
          className="w-full bg-transparent px-4 py-2 text-center text-2xl text-gray-700 dark:text-gray-300 placeholder:text-lg placeholder:text-gray-400 focus:outline-none border-b border-gray-300 dark:border-gray-600 focus:border-primary transition-colors"
          value={inputValue}
          onChange={handleInputChange}
          style={{
            fontFamily: '"Dancing Script", "Great Vibes", "Alex Brush", "Brush Script MT", "Lucida Handwriting", cursive'
          }}
        />
        
        {/* Preview area */}
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
              <div className="text-sm mb-2" style={{ fontFamily: 'Avenir, sans-serif' }}>Signature Preview</div>
              <div 
                className="text-lg"
                style={{
                  fontFamily: '"Dancing Script", "Great Vibes", "Alex Brush", "Brush Script MT", "Lucida Handwriting", cursive'
                }}
              >
                Your signature will appear here
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Upload component
interface SignaturePadUploadProps {
  value: string;
  onChange: (value: string) => void;
}

const SignaturePadUpload: React.FC<SignaturePadUploadProps> = ({ value, onChange }) => {
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
            className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold mb-0"
            style={{ fontFamily: 'Avenir, sans-serif' }}
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

// Main Signature Modal Component
export const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialValue = '',
  drawEnabled = true,
  typeEnabled = true,
  uploadEnabled = true,
  title = 'Add Your Signature',
  confirmText = 'Save',
  cancelText = 'Cancel',
}) => {
  const [activeTab, setActiveTab] = useState<SignatureType>(() => {
    if (drawEnabled) return SignatureType.DRAW;
    if (typeEnabled) return SignatureType.TYPE;
    if (uploadEnabled) return SignatureType.UPLOAD;
    return SignatureType.DRAW;
  });

  const [signatureValue, setSignatureValue] = useState<SignatureValue>({
    type: activeTab,
    value: initialValue,
  });

  const handleTabChange = (tab: SignatureType) => {
    setActiveTab(tab);
    setSignatureValue(prev => ({ ...prev, type: tab }));
  };

  const handleSave = () => {
    if (signatureValue.value) {
      onSave(signatureValue);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Great+Vibes&family=Alex+Brush&display=swap');
      `}</style>
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4"
        >
          {/* Header */}
          <div className="px-6 py-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Avenir, sans-serif' }}>{title}</h2>
          </div>

          {/* Tabs */}
          <div className="px-6 py-4">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {drawEnabled && (
                <button
                  onClick={() => handleTabChange(SignatureType.DRAW)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === SignatureType.DRAW
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                >
                  <LuPen className="w-4 h-4" />
                  Draw
                </button>
              )}
              {typeEnabled && (
                <button
                  onClick={() => handleTabChange(SignatureType.TYPE)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === SignatureType.TYPE
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                >
                  <LuType className="w-4 h-4" />
                  Type
                </button>
              )}
              {uploadEnabled && (
                <button
                  onClick={() => handleTabChange(SignatureType.UPLOAD)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === SignatureType.UPLOAD
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                >
                  <HiOutlineUpload className="w-4 h-4" />
                  Upload
                </button>
              )}
            </div>

            {/* Content */}
            <div className="mt-4 h-64">
              {activeTab === SignatureType.DRAW && (
                <SignaturePadDraw
                  value={signatureValue.value}
                  onChange={(value) => setSignatureValue(prev => ({ ...prev, value }))}
                />
              )}
              {activeTab === SignatureType.TYPE && (
                <SignaturePadType
                  value={signatureValue.value}
                  onChange={(value) => setSignatureValue(prev => ({ ...prev, value }))}
                />
              )}
              {activeTab === SignatureType.UPLOAD && (
                <SignaturePadUpload
                  value={signatureValue.value}
                  onChange={(value) => setSignatureValue(prev => ({ ...prev, value }))}
                />
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-1">
            <button
              onClick={onClose}
              className="flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold"
              style={{ fontFamily: 'Avenir, sans-serif' }}
            >
              {cancelText}
            </button>
            <button
              onClick={handleSave}
              disabled={!signatureValue.value}
              className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Avenir, sans-serif' }}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}; 