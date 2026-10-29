/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Download, Shirt, Scroll, CreditCard, Image, Flag, Package } from 'lucide-react';
import { DesignCategory } from '../types/design';

interface MockupModalProps {
  isOpen: boolean;
  onClose: () => void;
  svgString: string;
  category: DesignCategory;
  isDarkMode: boolean;
}

type MockupType = 'tshirt_black' | 'tshirt_white' | 'rollup_stand' | 'business_card_desk' | 'poster_frame' | 'banner_store' | 'pouch';

export const MockupModal: React.FC<MockupModalProps> = ({
  isOpen,
  onClose,
  svgString,
  category,
  isDarkMode,
}) => {
  // Tentukan mockup default berdasarkan kategori
  const getDefaultMockup = (): MockupType => {
    switch (category) {
      case 'tshirt':
        return 'tshirt_black';
      case 'businesscard':
        return 'business_card_desk';
      case 'xbanner':
      case 'rollup':
        return 'rollup_stand';
      case 'banner':
        return 'banner_store';
      case 'packaging':
      case 'sticker':
        return 'pouch';
      default:
        return 'poster_frame';
    }
  };

  const [activeMockup, setActiveMockup] = useState<MockupType>(getDefaultMockup());

  if (!isOpen) return null;

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
            <h3 className="font-bold text-base">Pratinjau Mockup Realistis</h3>
            <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded font-medium">
              3D Environment
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-500/20 text-gray-400 hover:text-white transition-colors"
            aria-label="Tutup Mockup"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mockup Selection Buttons */}
        <div className="px-6 py-3 border-b border-gray-500/20 flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveMockup('poster_frame')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 shrink-0 transition-all ${
              activeMockup === 'poster_frame'
                ? 'bg-indigo-600 text-white'
                : 'hover:bg-gray-500/15 text-gray-400'
            }`}
          >
            <Image size={14} />
            <span>Poster di Dinding</span>
          </button>

          <button
            onClick={() => setActiveMockup('tshirt_black')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 shrink-0 transition-all ${
              activeMockup === 'tshirt_black'
                ? 'bg-indigo-600 text-white'
                : 'hover:bg-gray-500/15 text-gray-400'
            }`}
          >
            <Shirt size={14} />
            <span>Kaos Hitam Sablon</span>
          </button>

          <button
            onClick={() => setActiveMockup('tshirt_white')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 shrink-0 transition-all ${
              activeMockup === 'tshirt_white'
                ? 'bg-indigo-600 text-white'
                : 'hover:bg-gray-500/15 text-gray-400'
            }`}
          >
            <Shirt size={14} />
            <span>Kaos Putih</span>
          </button>

          <button
            onClick={() => setActiveMockup('rollup_stand')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 shrink-0 transition-all ${
              activeMockup === 'rollup_stand'
                ? 'bg-indigo-600 text-white'
                : 'hover:bg-gray-500/15 text-gray-400'
            }`}
          >
            <Scroll size={14} />
            <span>Roll-Up / X-Banner</span>
          </button>

          <button
            onClick={() => setActiveMockup('business_card_desk')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 shrink-0 transition-all ${
              activeMockup === 'business_card_desk'
                ? 'bg-indigo-600 text-white'
                : 'hover:bg-gray-500/15 text-gray-400'
            }`}
          >
            <CreditCard size={14} />
            <span>Kartu Nama Meja</span>
          </button>

          <button
            onClick={() => setActiveMockup('banner_store')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 shrink-0 transition-all ${
              activeMockup === 'banner_store'
                ? 'bg-indigo-600 text-white'
                : 'hover:bg-gray-500/15 text-gray-400'
            }`}
          >
            <Flag size={14} />
            <span>Spanduk Toko</span>
          </button>

          <button
            onClick={() => setActiveMockup('pouch')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 shrink-0 transition-all ${
              activeMockup === 'pouch'
                ? 'bg-indigo-600 text-white'
                : 'hover:bg-gray-500/15 text-gray-400'
            }`}
          >
            <Package size={14} />
            <span>Standing Pouch</span>
          </button>
        </div>

        {/* Mockup Canvas Stage */}
        <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-[#090C12] min-h-[380px] relative">
          {/* 1. Kaos Hitam */}
          {activeMockup === 'tshirt_black' && (
            <div className="relative w-80 h-96 flex items-center justify-center">
              <svg viewBox="0 0 400 480" className="w-full h-full drop-shadow-2xl">
                {/* Silhouette T-Shirt Hitam */}
                <path
                  d="M130,40 Q200,85 270,40 L370,110 L320,180 L280,150 L280,440 L120,440 L120,150 L80,180 L30,110 Z"
                  fill="#18181B"
                  stroke="#27272A"
                  strokeWidth="3"
                />
                {/* Lipatan kain halus */}
                <path d="M120,150 Q160,200 150,300" stroke="#09090B" strokeWidth="2" opacity="0.6" fill="none" />
                <path d="M280,150 Q240,200 250,300" stroke="#09090B" strokeWidth="2" opacity="0.6" fill="none" />
              </svg>
              {/* Graphic Area */}
              <div
                className="absolute top-[120px] w-36 h-48 flex items-center justify-center overflow-hidden [&_svg]:w-full [&_svg]:h-full opacity-90 mix-blend-screen"
                dangerouslySetInnerHTML={{ __html: svgString }}
              />
            </div>
          )}

          {/* 2. Kaos Putih */}
          {activeMockup === 'tshirt_white' && (
            <div className="relative w-80 h-96 flex items-center justify-center">
              <svg viewBox="0 0 400 480" className="w-full h-full drop-shadow-2xl">
                <path
                  d="M130,40 Q200,85 270,40 L370,110 L320,180 L280,150 L280,440 L120,440 L120,150 L80,180 L30,110 Z"
                  fill="#F4F4F5"
                  stroke="#E4E4E7"
                  strokeWidth="3"
                />
                <path d="M120,150 Q160,200 150,300" stroke="#D4D4D8" strokeWidth="2" opacity="0.5" fill="none" />
                <path d="M280,150 Q240,200 250,300" stroke="#D4D4D8" strokeWidth="2" opacity="0.5" fill="none" />
              </svg>
              <div
                className="absolute top-[120px] w-36 h-48 flex items-center justify-center overflow-hidden [&_svg]:w-full [&_svg]:h-full opacity-90 mix-blend-multiply"
                dangerouslySetInnerHTML={{ __html: svgString }}
              />
            </div>
          )}

          {/* 3. Poster di Dinding Galeri */}
          {activeMockup === 'poster_frame' && (
            <div className="relative w-[340px] h-[460px] bg-[#1E293B] rounded-lg shadow-2xl p-4 flex items-center justify-center border-8 border-[#0F172A]">
              <div className="w-full h-full bg-white shadow-inner overflow-hidden flex items-center justify-center [&_svg]:w-full [&_svg]:h-full">
                <div
                  className="w-full h-full flex items-center justify-center [&_svg]:w-full [&_svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: svgString }}
                />
              </div>
            </div>
          )}

          {/* 4. Roll-Up Stand */}
          {activeMockup === 'rollup_stand' && (
            <div className="relative flex flex-col items-center">
              {/* Tiang & Banner Roll-up */}
              <div className="w-[180px] h-[420px] bg-white rounded-t shadow-2xl border border-gray-400 overflow-hidden flex items-center justify-center [&_svg]:w-full [&_svg]:h-full">
                <div
                  className="w-full h-full flex items-center justify-center [&_svg]:w-full [&_svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: svgString }}
                />
              </div>
              {/* Kaki Alumunium Bawah */}
              <div className="w-[220px] h-4 bg-gradient-to-r from-gray-400 via-gray-200 to-gray-400 rounded-b shadow-lg" />
              <div className="w-24 h-2 bg-gray-500 rounded-b" />
            </div>
          )}

          {/* 5. Kartu Nama di Meja */}
          {activeMockup === 'business_card_desk' && (
            <div className="relative w-[380px] h-[240px] flex items-center justify-center">
              {/* Stack kartu nama belakang */}
              <div className="absolute w-[320px] h-[190px] bg-gray-700 rounded-lg shadow-lg rotate-3 opacity-30" />
              <div className="absolute w-[320px] h-[190px] bg-gray-800 rounded-lg shadow-xl -rotate-2 opacity-50" />
              {/* Kartu nama utama */}
              <div className="relative w-[320px] h-[190px] bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200 flex items-center justify-center [&_svg]:w-full [&_svg]:h-full">
                <div
                  className="w-full h-full flex items-center justify-center [&_svg]:w-full [&_svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: svgString }}
                />
              </div>
            </div>
          )}

          {/* 6. Spanduk Toko */}
          {activeMockup === 'banner_store' && (
            <div className="relative w-[500px] max-w-[90vw] flex flex-col items-center">
              {/* Rangka Papan Ruko */}
              <div className="w-full h-10 bg-slate-800 rounded-t flex items-center justify-between px-4 border-b border-slate-700">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="text-[10px] text-gray-400 font-mono">PAPAN RUKO 3 × 1 METER</span>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              {/* Banner Terbentang */}
              <div className="w-full h-[180px] bg-white shadow-2xl overflow-hidden flex items-center justify-center border-4 border-slate-900 [&_svg]:w-full [&_svg]:h-full">
                <div
                  className="w-full h-full flex items-center justify-center [&_svg]:w-full [&_svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: svgString }}
                />
              </div>
              {/* Tiang gantungan */}
              <div className="w-[102%] h-3 bg-zinc-700 rounded-b shadow" />
            </div>
          )}

          {/* 7. Standing Pouch */}
          {activeMockup === 'pouch' && (
            <div className="relative w-[220px] h-[340px] bg-gradient-to-b from-gray-200 to-gray-400 rounded-t-2xl rounded-b-lg shadow-2xl p-3 flex flex-col items-center justify-between border border-gray-400">
              {/* Zipper atas */}
              <div className="w-full h-3 border-b-2 border-dashed border-gray-500 mb-2" />
              {/* Stiker label kemasan */}
              <div className="w-36 h-52 bg-white rounded-md shadow-md overflow-hidden flex items-center justify-center [&_svg]:w-full [&_svg]:h-full">
                <div
                  className="w-full h-full flex items-center justify-center [&_svg]:w-full [&_svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: svgString }}
                />
              </div>
              {/* Gusset bawah */}
              <div className="w-full h-6 bg-gray-400/80 rounded-b-lg mt-2" />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-500/20 flex items-center justify-between text-xs text-gray-400">
          <span>Pratinjau visual sebelum dicetak fisik di percetakan</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
