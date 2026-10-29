/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { X, Building, Upload, Check, Save } from 'lucide-react';
import { BusinessProfile } from '../types/design';

interface BusinessProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: BusinessProfile;
  onSaveProfile: (profile: BusinessProfile) => void;
  isDarkMode: boolean;
}

export const BusinessProfileModal: React.FC<BusinessProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  isDarkMode,
}) => {
  const [formData, setFormData] = useState<BusinessProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData({ ...formData, logoBase64: event.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
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
            <Building size={18} className="text-blue-400" />
            <h3 className="font-bold text-base">Profil Usaha Percetakan / Pemesan</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-500/20 text-gray-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3.5 text-xs">
          <p className="text-gray-400 text-[11px] leading-relaxed">
            Data profil usaha disimpan di browser Anda sehingga otomatis mengisi formulir desain tanpa mengetik ulang.
          </p>

          <div>
            <label className="text-[11px] font-semibold text-gray-300 block mb-1">
              Nama Usaha / Brand
            </label>
            <input
              type="text"
              required
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              placeholder="Contoh: Percetakan Berkah Grafika"
              className={`w-full px-3 py-2 rounded-lg border outline-none focus:ring-1 focus:ring-indigo-500 ${
                isDarkMode ? 'bg-[#0F1117] border-[#2A2F3C]' : 'bg-slate-50 border-slate-200'
              }`}
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-gray-300 block mb-1">
              Slogan / Tagline
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="Contoh: Cetak Cepat, Tajam, dan Berkualitas"
              className={`w-full px-3 py-2 rounded-lg border outline-none focus:ring-1 focus:ring-indigo-500 ${
                isDarkMode ? 'bg-[#0F1117] border-[#2A2F3C]' : 'bg-slate-50 border-slate-200'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                Nomor WhatsApp
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0812-3456-7890"
                className={`w-full px-3 py-2 rounded-lg border outline-none focus:ring-1 focus:ring-indigo-500 ${
                  isDarkMode ? 'bg-[#0F1117] border-[#2A2F3C]' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                Instagram / Medsos
              </label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                placeholder="@berkahgrafika"
                className={`w-full px-3 py-2 rounded-lg border outline-none focus:ring-1 focus:ring-indigo-500 ${
                  isDarkMode ? 'bg-[#0F1117] border-[#2A2F3C]' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-gray-300 block mb-1">
              Alamat Lengkap Usaha
            </label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Jl. Percetakan Negara No. 12, Jakarta Pusat"
              className={`w-full p-2.5 rounded-lg border outline-none focus:ring-1 focus:ring-indigo-500 resize-none ${
                isDarkMode ? 'bg-[#0F1117] border-[#2A2F3C]' : 'bg-slate-50 border-slate-200'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 items-center">
            {/* Color */}
            <div>
              <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                Warna Brand Utama
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                />
                <span className="font-mono text-gray-400">{formData.primaryColor}</span>
              </div>
            </div>

            {/* Logo */}
            <div>
              <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                Logo Usaha
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`w-full py-2 px-3 border border-dashed rounded-lg text-center flex items-center justify-center gap-2 text-xs ${
                  formData.logoBase64 ? 'border-indigo-500 text-indigo-400' : 'border-gray-500'
                }`}
              >
                <Upload size={14} />
                <span>{formData.logoBase64 ? 'Ganti Logo' : 'Unggah Logo'}</span>
              </button>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-gray-500/20 flex items-center justify-between">
            {savedSuccess ? (
              <span className="text-emerald-400 flex items-center gap-1 font-semibold text-xs">
                <Check size={14} /> Profil Berhasil Disimpan!
              </span>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
              >
                <Save size={14} />
                <span>Simpan Profil</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
