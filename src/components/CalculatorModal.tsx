/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Calculator, Copy, Check, Share2, Tag, ShieldCheck } from 'lucide-react';
import { DimensionResult, calculateGrommets, calculatePrintCost } from '../utils/printCalc';

interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  dimensions: DimensionResult;
  category: string;
  isDarkMode: boolean;
}

export const CalculatorModal: React.FC<CalculatorModalProps> = ({
  isOpen,
  onClose,
  dimensions,
  category,
  isDarkMode,
}) => {
  const [costPerM2, setCostPerM2] = useState<number>(
    category === 'banner' || category === 'xbanner' || category === 'rollup' ? 25000 : 35000
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [includeGrommets, setIncludeGrommets] = useState<boolean>(
    category === 'banner'
  );
  const [grommetPrice] = useState<number>(1000); // Rp 1.000 per ring
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const grommetCount = includeGrommets ? calculateGrommets(dimensions.widthM, dimensions.heightM) : 0;
  const finishingCost = grommetCount * grommetPrice;

  const cost = calculatePrintCost(dimensions.areaM2, quantity, {
    costPerM2,
    finishingCost,
  });

  const calculationSummaryText = `*PrintStudio AI - Estimasi Biaya Cetak* 🖨️
• Jenis: ${category.toUpperCase()}
• Ukuran: ${dimensions.widthCm} x ${dimensions.heightCm} cm (${dimensions.areaM2} m²)
• Jumlah: ${quantity} pcs
• Harga Bahan: Rp ${costPerM2.toLocaleString('id-ID')}/m²
${includeGrommets ? `• Finishing: ${grommetCount} Mata Ayam (Rp ${finishingCost.toLocaleString('id-ID')})\n` : ''}• *Total Biaya:* ${cost.formattedTotal}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(calculationSummaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWa = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(calculationSummaryText)}`, '_blank');
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
            <Calculator size={18} className="text-emerald-400" />
            <h3 className="font-bold text-base">Kalkulator Luas &amp; Biaya Cetak</h3>
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
          {/* Dimension Highlight Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/20 grid grid-cols-3 gap-2 text-center">
            <div>
              <span className="text-[10px] text-gray-400 block uppercase">Ukuran Fisik</span>
              <span className="font-bold font-mono text-indigo-400 text-sm">
                {dimensions.widthCm} × {dimensions.heightCm} cm
              </span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block uppercase">Luas Cetak</span>
              <span className="font-bold font-mono text-emerald-400 text-sm">
                {dimensions.areaM2} m²
              </span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block uppercase">Resolusi Cetak</span>
              <span className="font-bold font-mono text-amber-400 text-sm">
                300 DPI
              </span>
            </div>
          </div>

          {/* Pricing Controls */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                  Biaya Bahan per Meter² (Rp)
                </label>
                <input
                  type="number"
                  min={1000}
                  step={1000}
                  value={costPerM2}
                  onChange={(e) => setCostPerM2(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className={`w-full px-3 py-2 rounded-lg border font-mono outline-none ${
                    isDarkMode ? 'bg-[#0F1117] border-[#2A2F3C]' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                  Jumlah Cetak (Pcs)
                </label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className={`w-full px-3 py-2 rounded-lg border font-mono outline-none ${
                    isDarkMode ? 'bg-[#0F1117] border-[#2A2F3C]' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>
            </div>

            {/* Finishing check */}
            <div
              className={`p-3 rounded-lg border flex items-center justify-between ${
                isDarkMode ? 'bg-[#0F1117] border-[#2A2F3C]' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div>
                <div className="font-semibold text-gray-200">Mata Ayam / Ring Logam</div>
                <div className="text-[11px] text-gray-400">
                  Estimasi otomatis: {grommetCount} buah lubang ring keliling
                </div>
              </div>
              <input
                type="checkbox"
                checked={includeGrommets}
                onChange={(e) => setIncludeGrommets(e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer accent-indigo-600"
              />
            </div>
          </div>

          {/* Subtotal & Total Box */}
          <div className="p-4 rounded-xl bg-[#090C12] border border-[#2A2F3C] space-y-2">
            <div className="flex justify-between text-gray-400 text-xs">
              <span>Subtotal Bahan ({quantity} pcs)</span>
              <span className="font-mono">Rp {cost.subtotal.toLocaleString('id-ID')}</span>
            </div>
            {includeGrommets && (
              <div className="flex justify-between text-gray-400 text-xs">
                <span>Finishing Mata Ayam ({grommetCount} × Rp 1.000)</span>
                <span className="font-mono">Rp {cost.finishing.toLocaleString('id-ID')}</span>
              </div>
            )}
            <div className="border-t border-gray-700 pt-2 flex justify-between items-center text-sm font-bold">
              <span className="text-white">Estimasi Total Biaya:</span>
              <span className="text-emerald-400 text-base font-mono">{cost.formattedTotal}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-500/20 flex items-center justify-between text-xs">
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition-all ${
              copied
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                : 'border-[#2A2F3C] hover:bg-[#2A2F3C] text-gray-300'
            }`}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Tersalin!' : 'Salin Rincian'}</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleShareWa}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold"
            >
              <Share2 size={13} />
              <span>Kirim ke WhatsApp</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
