/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Printer,
  Sun,
  Moon,
  Share2,
  Download,
  FolderOpen,
  Calculator,
  UserCheck,
  Star,
  Copy,
  Check,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { copySvgToClipboard } from '../utils/exporter';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  projectName: string;
  onChangeProjectName: (name: string) => void;
  onOpenProjects: () => void;
  onOpenCalculator: () => void;
  onOpenBusinessProfile: () => void;
  onOpenTemplates: () => void;
  onShareWhatsApp: () => void;
  onExport: (format: 'svg' | 'png' | 'pdf' | 'jpg') => void;
  svgString: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  onToggleDarkMode,
  projectName,
  onChangeProjectName,
  onOpenProjects,
  onOpenCalculator,
  onOpenBusinessProfile,
  onOpenTemplates,
  onShareWhatsApp,
  onExport,
  svgString,
  isFavorite,
  onToggleFavorite,
}) => {
  const [copied, setCopied] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleCopySvg = async () => {
    const success = await copySvgToClipboard(svgString);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header
      className={`h-14 border-b px-4 flex items-center justify-between transition-colors z-20 select-none ${
        isDarkMode
          ? 'bg-[#171A23] border-[#2A2F3C] text-[#F3F4F6]'
          : 'bg-white border-slate-200 text-slate-800'
      }`}
    >
      {/* Brand & Project Name */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 font-bold tracking-tight text-base">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
            <Printer size={18} className="animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-[15px] leading-tight flex items-center gap-1.5">
              PrintStudio <span className="text-xs bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded font-mono font-medium">AI</span>
            </span>
            <span className="text-[10px] text-gray-400 font-medium tracking-normal">Prepress &amp; Vector Studio</span>
          </div>
        </div>

        <div className="hidden md:block h-6 w-px bg-[#2A2F3C]/40 mx-1" />

        {/* Project Name Editable Input */}
        <div className="hidden sm:flex items-center gap-1.5 group">
          <input
            type="text"
            value={projectName}
            onChange={(e) => onChangeProjectName(e.target.value)}
            title="Klik untuk mengubah nama proyek"
            className={`text-xs md:text-sm font-medium px-2 py-1 rounded border transition-colors outline-none focus:ring-1 focus:ring-indigo-500 max-w-[200px] lg:max-w-[260px] truncate ${
              isDarkMode
                ? 'bg-[#0F1117]/60 border-[#2A2F3C] text-gray-200 hover:border-gray-600 focus:bg-[#0F1117]'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-400 focus:bg-white'
            }`}
          />
          <button
            onClick={onToggleFavorite}
            title={isFavorite ? 'Hapus dari favorit' : 'Tandai sebagai favorit'}
            className={`p-1.5 rounded transition-colors ${
              isFavorite
                ? 'text-amber-400 hover:text-amber-300'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            aria-label="Tandai favorit"
          >
            <Star size={16} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Navigation Tools */}
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={onOpenTemplates}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
            isDarkMode
              ? 'hover:bg-[#2A2F3C] text-gray-300'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
          title="Buka Pustaka Template Siap Pakai"
        >
          <Layers size={14} className="text-indigo-400" />
          <span className="hidden lg:inline">Template</span>
        </button>

        <button
          onClick={onOpenCalculator}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
            isDarkMode
              ? 'hover:bg-[#2A2F3C] text-gray-300'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
          title="Kalkulator Luas dan Estimasi Biaya Cetak"
        >
          <Calculator size={14} className="text-emerald-400" />
          <span className="hidden lg:inline">Kalkulator Cetak</span>
        </button>

        <button
          onClick={onOpenBusinessProfile}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
            isDarkMode
              ? 'hover:bg-[#2A2F3C] text-gray-300'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
          title="Atur Profil Usaha & Logo Brand"
        >
          <UserCheck size={14} className="text-blue-400" />
          <span className="hidden lg:inline">Profil Usaha</span>
        </button>

        <button
          onClick={onOpenProjects}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
            isDarkMode
              ? 'hover:bg-[#2A2F3C] text-gray-300'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
          title="Daftar Proyek & Pesanan Pelanggan"
        >
          <FolderOpen size={14} className="text-amber-400" />
          <span className="hidden lg:inline">Proyek</span>
        </button>

        <div className="h-5 w-px bg-gray-500/20 mx-1 hidden sm:block" />

        {/* WhatsApp Share Button */}
        <button
          onClick={onShareWhatsApp}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all"
          title="Bagikan rincian desain lewat WhatsApp"
        >
          <Share2 size={14} />
          <span className="hidden sm:inline">WhatsApp</span>
        </button>

        {/* Copy SVG Button */}
        <button
          onClick={handleCopySvg}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold border transition-all ${
            copied
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
              : isDarkMode
              ? 'border-[#2A2F3C] hover:bg-[#2A2F3C] text-gray-300'
              : 'border-slate-200 hover:bg-slate-100 text-slate-700'
          }`}
          title="Salin kode vektor SVG ke clipboard untuk CorelDRAW / Illustrator"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          <span className="hidden md:inline">{copied ? 'Tersalin!' : 'Salin SVG'}</span>
        </button>

        {/* Export Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/30 transition-all"
            aria-label="Menu Ekspor Desain"
          >
            <Download size={14} />
            <span>Ekspor</span>
            <ChevronDown size={12} />
          </button>

          {showExportMenu && (
            <div
              className={`absolute right-0 mt-2 w-48 rounded-lg shadow-xl border py-1.5 z-50 text-xs ${
                isDarkMode
                  ? 'bg-[#171A23] border-[#2A2F3C] text-gray-200 divide-y divide-[#2A2F3C]'
                  : 'bg-white border-slate-200 text-slate-700 divide-y divide-slate-100'
              }`}
            >
              <div className="py-1">
                <button
                  onClick={() => {
                    onExport('svg');
                    setShowExportMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between font-semibold ${
                    isDarkMode ? 'hover:bg-[#2A2F3C]' : 'hover:bg-slate-100'
                  }`}
                >
                  <span>Vektor SVG</span>
                  <span className="text-[10px] text-indigo-400 font-mono">Corel / AI</span>
                </button>
                <button
                  onClick={() => {
                    onExport('pdf');
                    setShowExportMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between font-semibold ${
                    isDarkMode ? 'hover:bg-[#2A2F3C]' : 'hover:bg-slate-100'
                  }`}
                >
                  <span>PDF Siap Cetak</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Prepress</span>
                </button>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    onExport('png');
                    setShowExportMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between ${
                    isDarkMode ? 'hover:bg-[#2A2F3C]' : 'hover:bg-slate-100'
                  }`}
                >
                  <span>PNG Resolusi Tinggi</span>
                  <span className="text-[10px] text-gray-400 font-mono">300 DPI</span>
                </button>
                <button
                  onClick={() => {
                    onExport('jpg');
                    setShowExportMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between ${
                    isDarkMode ? 'hover:bg-[#2A2F3C]' : 'hover:bg-slate-100'
                  }`}
                >
                  <span>JPG Standar</span>
                  <span className="text-[10px] text-gray-400 font-mono">Foto Web</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dark/Light mode toggle */}
        <button
          onClick={onToggleDarkMode}
          className={`p-1.5 rounded-md border transition-colors ${
            isDarkMode
              ? 'border-[#2A2F3C] text-yellow-400 hover:bg-[#2A2F3C]'
              : 'border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
          title={isDarkMode ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
          aria-label="Toggle Mode Gelap/Terang"
        >
          {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>
    </header>
  );
};
