/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  MessageSquare,
  Sliders,
  History,
  Send,
  Sparkles,
  RotateCw,
  Check,
  Type,
  Palette,
  Layers,
  Trash2,
  Maximize2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { ChatMessage, DesignVersion } from '../types/design';
import { EditableElement } from '../utils/svgParser';

interface SidebarRightProps {
  isDarkMode: boolean;
  activeTab: 'chat' | 'properties' | 'history';
  onChangeTab: (tab: 'chat' | 'properties' | 'history') => void;
  chatMessages: ChatMessage[];
  onSendChatMessage: (prompt: string) => void;
  isRevising: boolean;
  editableElements: EditableElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElementText: (id: string, newText: string, newFill?: string, newFontSize?: number) => void;
  versions: DesignVersion[];
  currentVersionId: string;
  onRestoreVersion: (version: DesignVersion) => void;
}

export const SidebarRight: React.FC<SidebarRightProps> = ({
  isDarkMode,
  activeTab,
  onChangeTab,
  chatMessages,
  onSendChatMessage,
  isRevising,
  editableElements,
  selectedElementId,
  onSelectElement,
  onUpdateElementText,
  versions,
  currentVersionId,
  onRestoreVersion,
}) => {
  const [chatInput, setChatInput] = useState('');

  // Selected element state for direct editing
  const selectedElement = editableElements.find((e) => e.id === selectedElementId);
  const [editText, setEditText] = useState(selectedElement?.text || '');
  const [editFill, setEditFill] = useState(selectedElement?.fill || '#FFFFFF');
  const [editFontSize, setEditFontSize] = useState<number>(selectedElement?.fontSize || 24);

  // Sync when selected element changes
  React.useEffect(() => {
    if (selectedElement) {
      setEditText(selectedElement.text || '');
      setEditFill(selectedElement.fill || '#FFFFFF');
      setEditFontSize(selectedElement.fontSize || 24);
    }
  }, [selectedElementId, selectedElement]);

  const handleApplyElementEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedElementId) return;
    onUpdateElementText(selectedElementId, editText, editFill, editFontSize);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isRevising) return;
    onSendChatMessage(chatInput.trim());
    setChatInput('');
  };

  return (
    <aside
      className={`w-full md:w-80 lg:w-96 flex flex-col h-full border-l shrink-0 select-none ${
        isDarkMode
          ? 'bg-[#171A23] border-[#2A2F3C] text-[#F3F4F6]'
          : 'bg-white border-slate-200 text-slate-800'
      }`}
    >
      {/* 1. Header Tabs */}
      <div
        className={`h-11 border-b px-2 flex items-center justify-between shrink-0 ${
          isDarkMode ? 'border-[#2A2F3C]' : 'border-slate-200'
        }`}
      >
        <div className="flex gap-1 w-full">
          <button
            onClick={() => onChangeTab('chat')}
            className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'chat'
                ? 'bg-indigo-600 text-white shadow-sm'
                : isDarkMode
                ? 'text-gray-400 hover:text-gray-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare size={13} />
            <span>Revisi Chat</span>
          </button>

          <button
            onClick={() => onChangeTab('properties')}
            className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'properties'
                ? 'bg-indigo-600 text-white shadow-sm'
                : isDarkMode
                ? 'text-gray-400 hover:text-gray-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sliders size={13} />
            <span>Properti</span>
            {editableElements.length > 0 && (
              <span className="text-[10px] bg-black/20 px-1.5 rounded-full font-mono">
                {editableElements.length}
              </span>
            )}
          </button>

          <button
            onClick={() => onChangeTab('history')}
            className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'history'
                ? 'bg-indigo-600 text-white shadow-sm'
                : isDarkMode
                ? 'text-gray-400 hover:text-gray-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <History size={13} />
            <span>Riwayat ({versions.length})</span>
          </button>
        </div>
      </div>

      {/* 2. Content based on tab */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* TAB 1: REVISI CHAT */}
        {activeTab === 'chat' && (
          <div className="h-full flex flex-col justify-between space-y-4">
            {/* Chat Thread */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {chatMessages.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-xs space-y-2">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
                    <Sparkles size={20} />
                  </div>
                  <div className="font-semibold text-gray-200">Revisi Desain Lewat Chat</div>
                  <p className="text-[11px] leading-relaxed">
                    Ketik perintah apapun untuk mengubah elemen, warna, posisi, atau menambah ornamen baru.
                  </p>
                </div>
              ) : (
                chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[88%] p-3 rounded-xl text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-indigo-600 text-white font-medium'
                          : isDarkMode
                          ? 'bg-[#0F1117] border border-[#2A2F3C] text-gray-200'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1 font-mono">
                      {new Date(msg.timestamp).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                ))
              )}

              {isRevising && (
                <div className="flex items-center gap-2 text-xs text-indigo-400 bg-indigo-500/10 p-2.5 rounded-lg border border-indigo-500/20 animate-pulse">
                  <RotateCw size={14} className="animate-spin" />
                  <span>AI sedang memperbarui kode vektor SVG...</span>
                </div>
              )}
            </div>

            {/* Quick Revision Suggestions */}
            <div className="space-y-2 pt-2 border-t border-gray-500/20">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold block">
                Saran Cepat:
              </span>
              <div className="flex flex-wrap gap-1">
                {[
                  'Perbesar teks judul',
                  'Ubah warna jadi biru dongker',
                  'Tebalkan nomor kontak WA',
                  'Tambahkan badge Diskon 50%',
                  'Buat latar belakang lebih terang',
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => {
                      setChatInput(chip);
                      onSendChatMessage(chip);
                    }}
                    disabled={isRevising}
                    className={`text-[10px] px-2 py-1 rounded border transition-colors ${
                      isDarkMode
                        ? 'border-[#2A2F3C] bg-[#0F1117] text-gray-300 hover:text-indigo-400'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-indigo-600'
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendChat} className="flex gap-1.5 pt-1">
                <input
                  type="text"
                  placeholder="Ketik permintaan revisi..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={isRevising}
                  className={`flex-1 px-3 py-2 rounded-lg border text-xs outline-none focus:ring-1 focus:ring-indigo-500 ${
                    isDarkMode
                      ? 'bg-[#0F1117] border-[#2A2F3C] text-gray-200 placeholder-gray-500'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isRevising}
                  className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-lg transition-colors flex items-center justify-center"
                  aria-label="Kirim Revisi"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: PROPERTI KANVAS LANGSUNG */}
        {activeTab === 'properties' && (
          <div className="space-y-4 text-xs">
            {/* List of text layers in SVG */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center justify-between">
                <span>Daftar Elemen Teks</span>
                <span className="text-[10px] text-indigo-400 font-mono">
                  {editableElements.length} ditemukan
                </span>
              </label>

              <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
                {editableElements.map((el) => {
                  const isSelected = el.id === selectedElementId;
                  return (
                    <button
                      key={el.id}
                      type="button"
                      onClick={() => onSelectElement(el.id)}
                      className={`w-full text-left p-2 rounded-lg border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-500/15 text-indigo-400 font-bold'
                          : isDarkMode
                          ? 'border-[#2A2F3C] bg-[#0F1117] text-gray-300 hover:border-gray-600'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div className="truncate font-medium">{el.text}</div>
                        <div className="text-[10px] text-gray-400 font-mono">#{el.id}</div>
                      </div>
                      <div
                        className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                        style={{ backgroundColor: el.fill || '#ccc' }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Element Editor Form */}
            {selectedElement ? (
              <form
                onSubmit={handleApplyElementEdit}
                className={`p-3.5 rounded-xl border space-y-3 ${
                  isDarkMode ? 'bg-[#0F1117] border-[#2A2F3C]' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between border-b border-gray-500/20 pb-2">
                  <span className="font-bold text-indigo-400">Edit #{selectedElement.id}</span>
                  <span className="text-[10px] text-gray-400 font-mono">Teks SVG</span>
                </div>

                <div>
                  <span className="text-[11px] text-gray-400 block mb-1">Isi Teks</span>
                  <textarea
                    rows={2}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className={`w-full p-2 rounded-md border text-xs outline-none focus:ring-1 focus:ring-indigo-500 resize-none ${
                      isDarkMode ? 'bg-[#171A23] border-[#2A2F3C]' : 'bg-white border-slate-200'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[11px] text-gray-400 block mb-1">Warna Font</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={editFill}
                        onChange={(e) => setEditFill(e.target.value)}
                        className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={editFill}
                        onChange={(e) => setEditFill(e.target.value)}
                        className={`w-full px-2 py-1 rounded border text-xs font-mono outline-none ${
                          isDarkMode
                            ? 'bg-[#171A23] border-[#2A2F3C] text-gray-200'
                            : 'bg-white border-slate-200'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-gray-400 block mb-1">Ukuran Font (px)</span>
                    <input
                      type="number"
                      min={8}
                      max={300}
                      value={editFontSize}
                      onChange={(e) => setEditFontSize(parseFloat(e.target.value) || 24)}
                      className={`w-full px-2 py-1.5 rounded border text-xs font-mono outline-none ${
                        isDarkMode
                          ? 'bg-[#171A23] border-[#2A2F3C] text-gray-200'
                          : 'bg-white border-slate-200'
                      }`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs shadow-sm transition-colors cursor-pointer"
                >
                  Terapkan Perubahan Kanvas
                </button>
              </form>
            ) : (
              <div className="p-4 rounded-lg border border-dashed border-gray-600 text-center text-gray-400">
                Klik salah satu teks di atas atau langsung pada kanvas untuk mengedit isi, warna, dan ukuran font secara instan.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: RIWAYAT VERSI */}
        {activeTab === 'history' && (
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between text-gray-400 pb-1 border-b border-gray-500/20">
              <span className="font-semibold">Versi Tersimpan</span>
              <span className="text-[10px] font-mono">{versions.length} versi</span>
            </div>

            <div className="space-y-2">
              {versions.map((ver, idx) => {
                const isCurrent = ver.id === currentVersionId;
                return (
                  <div
                    key={ver.id}
                    className={`p-3 rounded-lg border transition-all ${
                      isCurrent
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : isDarkMode
                        ? 'border-[#2A2F3C] bg-[#0F1117] hover:border-gray-600'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-gray-200 flex items-center gap-1.5">
                        <span>Versi #{versions.length - idx}</span>
                        {isCurrent && (
                          <span className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.2 rounded font-normal">
                            Aktif
                          </span>
                        )}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                        <Clock size={11} />
                        {new Date(ver.timestamp).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-400 mb-2 line-clamp-2">
                      {ver.summary || 'Pembaruan desain pra-cetak.'}
                    </p>

                    {!isCurrent && (
                      <button
                        type="button"
                        onClick={() => onRestoreVersion(ver)}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                      >
                        <span>Pulihkan ke Kanvas</span>
                        <ArrowRight size={12} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
