/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import {
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Eye,
  EyeOff,
  Sparkles,
  Columns,
  Copy,
  Layers,
  RotateCw,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { DimensionResult } from '../utils/printCalc';
import { generateGuideLinesSvg } from '../utils/svgParser';

interface CanvasCenterProps {
  isDarkMode: boolean;
  svgString: string;
  dimensions: DimensionResult;
  conceptNote: string;
  fontAndPaletteAdvice: string;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onOpenMockup: () => void;
  onOpenCompare: () => void;
  onOpenResizeModal: () => void;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  isGenerating: boolean;
  generationStatusText: string;
  errorMessage: string | null;
  onRetry: () => void;
}

export const CanvasCenter: React.FC<CanvasCenterProps> = ({
  isDarkMode,
  svgString,
  dimensions,
  conceptNote,
  fontAndPaletteAdvice,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onOpenMockup,
  onOpenCompare,
  onOpenResizeModal,
  selectedElementId,
  onSelectElement,
  isGenerating,
  generationStatusText,
  errorMessage,
  onRetry,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showGuides, setShowGuides] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgWrapperRef = useRef<HTMLDivElement>(null);

  // Zoom helpers
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(2.5, prev + 0.15));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(0.4, prev - 0.15));
  const handleZoomReset = () => setZoomLevel(1);

  // Handle click on SVG elements to inspect/edit
  useEffect(() => {
    const wrapper = svgWrapperRef.current;
    if (!wrapper) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as SVGElement;
      if (!target) return;

      // Find closest text or labeled element
      const textElem = target.closest('text') || target.closest('[id]');
      if (textElem && textElem.id && textElem.id !== 'print-guides-overlay' && !textElem.id.startsWith('accent')) {
        onSelectElement(textElem.id);
      } else {
        // Klik di background kosong
        if (target.id === 'background' || target.tagName === 'svg') {
          onSelectElement(null);
        }
      }
    };

    wrapper.addEventListener('click', handleClick);
    return () => {
      wrapper.removeEventListener('click', handleClick);
    };
  }, [svgString, onSelectElement]);

  // Siapkan SVG dengan layer panduan bleed & safe area bila dinyalakan
  const processedSvg = React.useMemo(() => {
    if (!svgString) return '';
    if (!showGuides) return svgString;

    const overlay = generateGuideLinesSvg(
      svgString,
      dimensions.bleedMm,
      dimensions.safeAreaMm,
      dimensions.widthMm,
      dimensions.heightMm,
      showGuides
    );

    // Sisipkan overlay sebelum tag penutup </svg>
    const closingIndex = svgString.lastIndexOf('</svg>');
    if (closingIndex !== -1) {
      return svgString.substring(0, closingIndex) + overlay + svgString.substring(closingIndex);
    }
    return svgString;
  }, [svgString, showGuides, dimensions]);

  return (
    <main
      className={`flex-1 flex flex-col h-full relative overflow-hidden select-none transition-colors ${
        isDarkMode ? 'bg-[#0F1117]' : 'bg-[#F1F5F9]'
      }`}
    >
      {/* 1. Top Canvas Toolbar */}
      <div
        className={`h-11 border-b px-4 flex items-center justify-between text-xs shrink-0 z-10 ${
          isDarkMode
            ? 'bg-[#171A23]/90 border-[#2A2F3C] text-[#F3F4F6]'
            : 'bg-white/90 border-slate-200 text-slate-700'
        } backdrop-blur-sm`}
      >
        {/* Left: Undo, Redo, Zoom */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Urungkan Perubahan (Ctrl+Z)"
            aria-label="Undo"
            className={`p-1.5 rounded transition-colors ${
              canUndo
                ? isDarkMode
                  ? 'hover:bg-[#2A2F3C] text-gray-200'
                  : 'hover:bg-slate-100 text-slate-800'
                : 'opacity-30 cursor-not-allowed'
            }`}
          >
            <Undo2 size={15} />
          </button>

          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Ulangi Perubahan (Ctrl+Y)"
            aria-label="Redo"
            className={`p-1.5 rounded transition-colors ${
              canRedo
                ? isDarkMode
                  ? 'hover:bg-[#2A2F3C] text-gray-200'
                  : 'hover:bg-slate-100 text-slate-800'
                : 'opacity-30 cursor-not-allowed'
            }`}
          >
            <Redo2 size={15} />
          </button>

          <div className="h-4 w-px bg-gray-500/20 mx-1" />

          {/* Zoom controls */}
          <button
            onClick={handleZoomOut}
            title="Perkecil Kanvas"
            aria-label="Zoom Out"
            className={`p-1.5 rounded ${
              isDarkMode ? 'hover:bg-[#2A2F3C]' : 'hover:bg-slate-100'
            }`}
          >
            <ZoomOut size={15} />
          </button>

          <button
            onClick={handleZoomReset}
            title="Reset Zoom ke 100%"
            className="px-2 py-0.5 font-mono text-[11px] rounded hover:bg-gray-500/10 font-medium"
          >
            {Math.round(zoomLevel * 100)}%
          </button>

          <button
            onClick={handleZoomIn}
            title="Perbesar Kanvas"
            aria-label="Zoom In"
            className={`p-1.5 rounded ${
              isDarkMode ? 'hover:bg-[#2A2F3C]' : 'hover:bg-slate-100'
            }`}
          >
            <ZoomIn size={15} />
          </button>
        </div>

        {/* Center: Guidelines toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGuides(!showGuides)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
              showGuides
                ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400 font-semibold'
                : isDarkMode
                ? 'border-[#2A2F3C] text-gray-400 hover:text-gray-200'
                : 'border-slate-200 text-slate-500 hover:text-slate-800'
            }`}
            title="Tampilkan garis bantu batas Bleed (merah), Trim (abu-abu), dan Safe Area (hijau)"
          >
            {showGuides ? <Eye size={13} /> : <EyeOff size={13} />}
            <span>Panduan Cetak</span>
          </button>
        </div>

        {/* Right: Actions (Mockup, Compare, Resize) */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenCompare}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium transition-all ${
              isDarkMode
                ? 'border-[#2A2F3C] hover:bg-[#2A2F3C] text-gray-300'
                : 'border-slate-200 hover:bg-slate-100 text-slate-700'
            }`}
            title="Bandingkan dua versi desain berdampingan"
          >
            <Columns size={13} className="text-indigo-400" />
            <span>Bandingkan</span>
          </button>

          <button
            onClick={onOpenResizeModal}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium transition-all ${
              isDarkMode
                ? 'border-[#2A2F3C] hover:bg-[#2A2F3C] text-gray-300'
                : 'border-slate-200 hover:bg-slate-100 text-slate-700'
            }`}
            title="Duplikat dan sesuaikan desain ini ke ukuran cetak lain"
          >
            <Copy size={13} className="text-amber-400" />
            <span>Ubah Ukuran</span>
          </button>

          <button
            onClick={onOpenMockup}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm transition-all"
            title="Pratinjau tampilan realistis di Kaos, Banner, Kartu Nama, atau Poster"
          >
            <Layers size={13} />
            <span>Preview Mockup</span>
          </button>
        </div>
      </div>

      {/* 2. Main Canvas Viewport */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-4 md:p-8 flex items-center justify-center relative"
        style={{
          backgroundImage: isDarkMode
            ? 'radial-gradient(#2A2F3C 1px, transparent 1px)'
            : 'radial-gradient(#CBD5E1 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        {/* Loading Overlay */}
        {isGenerating && (
          <div className="absolute inset-0 z-30 bg-[#0F1117]/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center animate-pulse">
                <Sparkles size={32} className="text-indigo-400 animate-spin" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-white">
                {generationStatusText || 'Menyusun tata letak pra-cetak...'}
              </h3>
              <p className="text-xs text-gray-400 max-w-sm">
                AI menghitung margin bleed 3mm, safe area 5mm, dan hierarki teks tajam beresolusi vektor.
              </p>
            </div>
          </div>
        )}

        {/* Error Notification with Friendly Retry */}
        {errorMessage && !isGenerating && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 bg-red-950/90 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 max-w-md">
            <AlertTriangle size={20} className="text-red-400 shrink-0" />
            <div className="text-xs flex-1">
              <div className="font-bold text-red-100">Gagal Memproses Desain</div>
              <div>{errorMessage}</div>
            </div>
            <button
              onClick={onRetry}
              className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-colors shrink-0"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* SVG Print Stage */}
        <div
          ref={svgWrapperRef}
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'center center',
            transition: 'transform 0.15s ease-out',
            aspectRatio: `${Math.max(1, dimensions.widthMm)} / ${Math.max(1, dimensions.heightMm)}`,
            width: dimensions.widthMm >= dimensions.heightMm ? 'min(860px, 58vw)' : 'min(440px, 32vw)',
            maxHeight: '68vh',
            boxShadow: isDarkMode
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px #2A2F3C'
              : '0 20px 30px -10px rgba(0, 0, 0, 0.15), 0 0 0 1px #CBD5E1',
          }}
          className="relative flex items-center justify-center bg-white rounded-sm overflow-hidden select-none shrink-0"
        >
          {processedSvg ? (
            <div
              className="w-full h-full flex items-center justify-center [&_svg]:w-full [&_svg]:h-full [&_svg]:block cursor-crosshair"
              dangerouslySetInnerHTML={{ __html: processedSvg }}
            />
          ) : (
            <div className="p-16 text-center text-gray-400 text-sm">
              Memuat kanvas desain...
            </div>
          )}

          {/* Selection indicator pill */}
          {selectedElementId && (
            <div className="absolute top-2 right-2 bg-indigo-600 text-white text-[11px] font-mono px-2 py-0.5 rounded shadow">
              Elemen Terpilih: #{selectedElementId}
            </div>
          )}
        </div>
      </div>

      {/* 3. Bottom Information Bar */}
      <footer
        className={`h-11 border-t px-4 flex items-center justify-between text-xs shrink-0 select-none ${
          isDarkMode
            ? 'bg-[#171A23] border-[#2A2F3C] text-gray-300'
            : 'bg-white border-slate-200 text-slate-600'
        }`}
      >
        {/* Left: Dimension Specs */}
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="font-bold text-indigo-400">
            {dimensions.widthCm} × {dimensions.heightCm} cm
          </span>
          <span className="text-gray-500">•</span>
          <span>{dimensions.areaM2} m²</span>
          <span className="text-gray-500">•</span>
          <span>{dimensions.widthPx} × {dimensions.heightPx} px @ 300 DPI</span>
          <span className="text-gray-500">•</span>
          <span className="text-emerald-400">Bleed +{dimensions.bleedMm}mm</span>
        </div>

        {/* Right: AI Concept summary */}
        <div className="hidden md:flex items-center gap-2 max-w-[50%] truncate text-right">
          <span className="text-[11px] text-gray-400 truncate">
            {conceptNote || 'Vektor SVG siap cetak dengan batas presisi.'}
          </span>
          {fontAndPaletteAdvice && (
            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded shrink-0">
              {fontAndPaletteAdvice}
            </span>
          )}
        </div>
      </footer>
    </main>
  );
};
