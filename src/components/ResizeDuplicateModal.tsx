/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Copy, Check, ArrowRight } from 'lucide-react';
import { DesignCategory, SizePreset } from '../types/design';
import { SIZE_PRESETS, DESIGN_CATEGORIES } from '../utils/templatePresets';
import { UnitType, DpiType, calculatePrintDimensions } from '../utils/printCalc';

interface ResizeDuplicateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCategory: DesignCategory;
  currentWidth: number;
  currentHeight: number;
  currentUnit: UnitType;
  currentSvg: string;
  onApplyResize: (targetPreset: SizePreset, adaptedSvg: string) => void;
  isDarkMode: boolean;
}

export const ResizeDuplicateModal: React.FC<ResizeDuplicateModalProps> = ({
  isOpen,
  onClose,
  currentCategory,
  currentWidth,
  currentHeight,
  currentUnit,
  currentSvg,
  onApplyResize,
  isDarkMode,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    currentCategory === 'banner' ? 'poster_a3' : 'banner_3x1'
  );

  if (!isOpen) return null;

  const targetPreset = SIZE_PRESETS.find((p) => p.id === selectedPresetId) || SIZE_PRESETS[0];

  const handleDuplicate = () => {
    // Hitung dimensi target baru
    const newDim = calculatePrintDimensions({
      width: targetPreset.width,
      height: targetPreset.height,
      unit: targetPreset.unit,
      dpi: targetPreset.defaultDpi,
    });

    // Sesuaikan viewBox pada SVG saat ini agar proporsional dengan dimensi baru
    let adaptedSvg = currentSvg;
    if (adaptedSvg.includes('viewBox=')) {
      adaptedSvg = adaptedSvg.replace(
        /viewBox=["'][^"']*["']/i,
        `viewBox="${newDim.viewBox}"`
      );
    } else {
      adaptedSvg = adaptedSvg.replace('<svg', `<svg viewBox="${newDim.viewBox}"`);
    }

    onApplyResize(targetPreset, adaptedSvg);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className={`w-full max-w-lg rounded-2xl border shadow-2xl flex flex-col overflow-hidden ${
          isDarkMode
            ? 'bg-[#171A23] border-[#2A2F3C] text-[#F3F4F6]'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base">Duplikat ke Ukuran Lain</h3>
            <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-medium">
              Multi-Format
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-500/20 text-gray-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
            Desain saat ini berukuran <strong>{currentWidth} × {currentHeight} {currentUnit}</strong>.
            Pilih ukuran tujuan untuk menduplikat karya ini ke format media cetak lain secara otomatis.
          </div>

          <div className="space-y-2">
            <label className="font-bold text-gray-300 block">Pilih Ukuran Target:</label>
            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {SIZE_PRESETS.map((p) => {
                const isSelected = p.id === selectedPresetId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPresetId(p.id)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/15 text-indigo-400 font-bold'
                        : isDarkMode
                        ? 'border-[#2A2F3C] bg-[#0F1117] text-gray-300 hover:border-gray-600'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-[11px] text-gray-400 font-mono">
                        {p.width} × {p.height} {p.unit} ({p.category})
                      </div>
                    </div>
                    {isSelected && <Check size={16} className="text-indigo-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-500/20 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs font-semibold"
          >
            Batal
          </button>
          <button
            onClick={handleDuplicate}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
          >
            <Copy size={13} />
            <span>Duplikat Desain Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  );
};
