/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Check, ArrowRight, History } from 'lucide-react';
import { DesignVersion } from '../types/design';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  versions: DesignVersion[];
  currentVersionId: string;
  onSelectVersion: (version: DesignVersion) => void;
  isDarkMode: boolean;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  versions,
  currentVersionId,
  onSelectVersion,
  isDarkMode,
}) => {
  if (!isOpen) return null;

  // Set default selection to current version and previous version (if exists)
  const [versionAId, setVersionAId] = useState<string>(
    versions.length > 1 ? versions[1].id : versions[0]?.id || ''
  );
  const [versionBId, setVersionBId] = useState<string>(
    currentVersionId || versions[0]?.id || ''
  );

  const versionA = versions.find((v) => v.id === versionAId) || versions[0];
  const versionB = versions.find((v) => v.id === versionBId) || versions[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className={`w-full max-w-5xl max-h-[92vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden ${
          isDarkMode
            ? 'bg-[#171A23] border-[#2A2F3C] text-[#F3F4F6]'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base">Bandingkan Dua Versi Desain</h3>
            <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded font-medium">
              Berdampingan
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-500/20 text-gray-400 hover:text-white"
            aria-label="Tutup Perbandingan"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content: Dual Split View */}
        <div className="flex-1 overflow-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#090C12]">
          {/* Side A */}
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-300">Versi Kiri (A)</label>
              <select
                value={versionAId}
                onChange={(e) => setVersionAId(e.target.value)}
                className={`text-xs px-2.5 py-1 rounded border outline-none ${
                  isDarkMode
                    ? 'bg-[#171A23] border-[#2A2F3C] text-gray-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                {versions.map((v, i) => (
                  <option key={v.id} value={v.id}>
                    Versi #{versions.length - i} ({new Date(v.timestamp).toLocaleTimeString()})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-h-[300px] max-h-[460px] bg-white rounded-lg shadow-xl overflow-hidden p-3 flex items-center justify-center border border-gray-700">
              {versionA ? (
                <div
                  className="w-full h-full flex items-center justify-center [&_svg]:max-w-full [&_svg]:max-h-full [&_svg]:w-auto [&_svg]:h-auto"
                  dangerouslySetInnerHTML={{ __html: versionA.svg }}
                />
              ) : (
                <span className="text-xs text-gray-400">Pilih versi</span>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <p className="text-[11px] text-gray-400 truncate flex-1 pr-2">
                {versionA?.summary || 'Desain versi A'}
              </p>
              <button
                onClick={() => {
                  if (versionA) onSelectVersion(versionA);
                  onClose();
                }}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold shrink-0"
              >
                Gunakan Versi A
              </button>
            </div>
          </div>

          {/* Side B */}
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-300">Versi Kanan (B)</label>
              <select
                value={versionBId}
                onChange={(e) => setVersionBId(e.target.value)}
                className={`text-xs px-2.5 py-1 rounded border outline-none ${
                  isDarkMode
                    ? 'bg-[#171A23] border-[#2A2F3C] text-gray-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                {versions.map((v, i) => (
                  <option key={v.id} value={v.id}>
                    Versi #{versions.length - i} ({new Date(v.timestamp).toLocaleTimeString()})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-h-[300px] max-h-[460px] bg-white rounded-lg shadow-xl overflow-hidden p-3 flex items-center justify-center border border-gray-700">
              {versionB ? (
                <div
                  className="w-full h-full flex items-center justify-center [&_svg]:max-w-full [&_svg]:max-h-full [&_svg]:w-auto [&_svg]:h-auto"
                  dangerouslySetInnerHTML={{ __html: versionB.svg }}
                />
              ) : (
                <span className="text-xs text-gray-400">Pilih versi</span>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <p className="text-[11px] text-gray-400 truncate flex-1 pr-2">
                {versionB?.summary || 'Desain versi B'}
              </p>
              <button
                onClick={() => {
                  if (versionB) onSelectVersion(versionB);
                  onClose();
                }}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold shrink-0"
              >
                Gunakan Versi B
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-500/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white text-xs font-semibold rounded-lg"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
