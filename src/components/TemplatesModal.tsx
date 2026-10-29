/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Layers, Check, Sparkles } from 'lucide-react';
import { DesignCategory, SizePreset } from '../types/design';
import { DESIGN_CATEGORIES, SIZE_PRESETS, getStarterTemplate } from '../utils/templatePresets';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (category: DesignCategory, preset: SizePreset, svg: string) => void;
  isDarkMode: boolean;
  primaryColor: string;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  isDarkMode,
  primaryColor,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<DesignCategory>('banner');

  if (!isOpen) return null;

  const filteredPresets = SIZE_PRESETS.filter((p) => p.category === selectedCategory);

  const handleApply = (preset: SizePreset) => {
    const templateSvg = getStarterTemplate(preset.category, preset.width, preset.height, primaryColor);
    onSelectTemplate(preset.category, preset, templateSvg);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className={`w-full max-w-4xl max-h-[90vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden ${
          isDarkMode
            ? 'bg-[#171A23] border-[#2A2F3C] text-[#F3F4F6]'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-indigo-400" />
            <h3 className="font-bold text-base">Pustaka Template Desain Cetak</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-500/20 text-gray-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="px-6 py-3 border-b border-gray-500/20 flex items-center gap-2 overflow-x-auto text-xs">
          {DESIGN_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white'
                  : 'hover:bg-gray-500/15 text-gray-400'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-[#090C12]">
          {filteredPresets.map((preset) => {
            const previewSvg = getStarterTemplate(preset.category, preset.width, preset.height, primaryColor);
            return (
              <div
                key={preset.id}
                onClick={() => handleApply(preset)}
                className="group border border-gray-800 hover:border-indigo-500 bg-[#171A23] rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col"
              >
                {/* Visual SVG Card */}
                <div className="h-44 bg-slate-900 flex items-center justify-center p-3 overflow-hidden border-b border-gray-800">
                  <div
                    className="w-full h-full flex items-center justify-center [&_svg]:max-w-full [&_svg]:max-h-full transition-transform group-hover:scale-105"
                    dangerouslySetInnerHTML={{ __html: previewSvg }}
                  />
                </div>

                {/* Details */}
                <div className="p-3.5 flex flex-col justify-between flex-1 space-y-2">
                  <div>
                    <h4 className="font-bold text-xs text-white group-hover:text-indigo-400 transition-colors">
                      {preset.name}
                    </h4>
                    <p className="text-[11px] text-gray-400 line-clamp-2 mt-1">
                      {preset.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-800 flex items-center justify-between text-[10px] text-gray-400 font-mono">
                    <span>
                      {preset.width} × {preset.height} {preset.unit}
                    </span>
                    <span className="text-indigo-400 font-sans font-semibold group-hover:underline">
                      Gunakan Template →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-500/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs font-semibold"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
