/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import {
  Sparkles,
  Layers,
  Sliders,
  Type,
  Upload,
  Image as ImageIcon,
  Palette,
  RotateCw,
  Info,
  Building,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import {
  DesignCategory,
  SizePreset,
  DesignStyle,
  InputMode,
  StructuredFormData,
  BusinessProfile,
} from '../types/design';
import {
  DESIGN_CATEGORIES,
  SIZE_PRESETS,
  STYLE_OPTIONS,
  COLOR_PALETTES,
} from '../utils/templatePresets';
import { UnitType, DpiType } from '../utils/printCalc';

interface SidebarLeftProps {
  isDarkMode: boolean;
  category: DesignCategory;
  onSelectCategory: (cat: DesignCategory) => void;
  width: number;
  height: number;
  unit: UnitType;
  dpi: DpiType;
  bleedMm: number;
  safeAreaMm: number;
  onUpdateDimensions: (params: {
    width?: number;
    height?: number;
    unit?: UnitType;
    dpi?: DpiType;
    bleedMm?: number;
    safeAreaMm?: number;
  }) => void;
  inputMode: InputMode;
  onChangeInputMode: (mode: InputMode) => void;
  description: string;
  onChangeDescription: (desc: string) => void;
  structuredData: StructuredFormData;
  onChangeStructuredData: (data: StructuredFormData) => void;
  selectedStyle: DesignStyle;
  onSelectStyle: (style: DesignStyle) => void;
  primaryColor: string;
  onSelectColor: (hex: string) => void;
  uploadedLogo: string | null;
  onUploadLogo: (base64: string | null) => void;
  uploadedPhoto: string | null;
  onUploadPhoto: (base64: string | null) => void;
  businessProfile: BusinessProfile | null;
  onApplyBusinessProfile: () => void;
  isGenerating: boolean;
  generationStatusText: string;
  onGenerate: () => void;
  onMakeVariation: () => void;
  canMakeVariation: boolean;
}

export const SidebarLeft: React.FC<SidebarLeftProps> = ({
  isDarkMode,
  category,
  onSelectCategory,
  width,
  height,
  unit,
  dpi,
  bleedMm,
  safeAreaMm,
  onUpdateDimensions,
  inputMode,
  onChangeInputMode,
  description,
  onChangeDescription,
  structuredData,
  onChangeStructuredData,
  selectedStyle,
  onSelectStyle,
  primaryColor,
  onSelectColor,
  uploadedLogo,
  onUploadLogo,
  uploadedPhoto,
  onUploadPhoto,
  businessProfile,
  onApplyBusinessProfile,
  isGenerating,
  generationStatusText,
  onGenerate,
  onMakeVariation,
  canMakeVariation,
}) => {
  const [isCustomSize, setIsCustomSize] = useState(false);
  const [showPrepressHelp, setShowPrepressHelp] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Filter presets for current category
  const categoryPresets = SIZE_PRESETS.filter((p) => p.category === category);

  // File Upload Handlers (PNG, JPG, SVG, max 5MB)
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'photo'
  ) => {
    const file = e.target.files?.[0];
    setUploadError(null);
    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Format tidak didukung. Harap unggah PNG, JPG, atau SVG.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Ukuran file maksimal 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (type === 'logo') {
        onUploadLogo(base64);
      } else {
        onUploadPhoto(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyPreset = (preset: SizePreset) => {
    setIsCustomSize(false);
    onUpdateDimensions({
      width: preset.width,
      height: preset.height,
      unit: preset.unit,
      dpi: preset.defaultDpi,
    });
  };

  return (
    <aside
      className={`w-full md:w-80 lg:w-96 flex flex-col h-full border-r overflow-y-auto shrink-0 select-none ${
        isDarkMode
          ? 'bg-[#171A23] border-[#2A2F3C] text-[#F3F4F6]'
          : 'bg-white border-slate-200 text-slate-800'
      }`}
    >
      <div className="p-4 space-y-5">
        {/* 1. Kategori Desain Cetak */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center justify-between">
            <span>Jenis Desain Cetak</span>
            <span className="text-[11px] font-normal text-indigo-400 lowercase">
              vektor siap cetak
            </span>
          </label>
          <select
            value={category}
            onChange={(e) => onSelectCategory(e.target.value as DesignCategory)}
            className={`w-full text-xs font-medium px-3 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer ${
              isDarkMode
                ? 'bg-[#0F1117] border-[#2A2F3C] text-gray-200'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            {DESIGN_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Ukuran Preset & Custom */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Ukuran Cetak
            </label>
            <div className="flex gap-1 bg-[#0F1117] p-0.5 rounded-md border border-[#2A2F3C]">
              <button
                type="button"
                onClick={() => setIsCustomSize(false)}
                className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                  !isCustomSize
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Preset
              </button>
              <button
                type="button"
                onClick={() => setIsCustomSize(true)}
                className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                  isCustomSize
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Custom
              </button>
            </div>
          </div>

          {!isCustomSize ? (
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {categoryPresets.map((preset) => {
                const isSelected =
                  width === preset.width &&
                  height === preset.height &&
                  unit === preset.unit;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className={`w-full text-left p-2 rounded-lg border text-xs transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 font-semibold'
                        : isDarkMode
                        ? 'border-[#2A2F3C] bg-[#0F1117]/50 hover:bg-[#0F1117] text-gray-300'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{preset.name}</div>
                      <div className="text-[10px] text-gray-400 font-mono">
                        {preset.width} × {preset.height} {preset.unit} • {preset.defaultDpi} DPI
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 size={14} className="text-indigo-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          ) : (
            <div
              className={`p-3 rounded-lg border space-y-3 ${
                isDarkMode ? 'bg-[#0F1117] border-[#2A2F3C]' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-gray-400 block mb-1">Lebar</span>
                  <input
                    type="number"
                    min={1}
                    value={width}
                    onChange={(e) =>
                      onUpdateDimensions({ width: Math.max(1, parseFloat(e.target.value) || 1) })
                    }
                    className={`w-full px-2 py-1.5 rounded border text-xs font-mono outline-none focus:ring-1 focus:ring-indigo-500 ${
                      isDarkMode
                        ? 'bg-[#171A23] border-[#2A2F3C] text-gray-200'
                        : 'bg-white border-slate-200'
                    }`}
                  />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block mb-1">Tinggi</span>
                  <input
                    type="number"
                    min={1}
                    value={height}
                    onChange={(e) =>
                      onUpdateDimensions({ height: Math.max(1, parseFloat(e.target.value) || 1) })
                    }
                    className={`w-full px-2 py-1.5 rounded border text-xs font-mono outline-none focus:ring-1 focus:ring-indigo-500 ${
                      isDarkMode
                        ? 'bg-[#171A23] border-[#2A2F3C] text-gray-200'
                        : 'bg-white border-slate-200'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-gray-400 block mb-1">Satuan</span>
                  <select
                    value={unit}
                    onChange={(e) => onUpdateDimensions({ unit: e.target.value as UnitType })}
                    className={`w-full px-2 py-1.5 rounded border text-xs font-medium outline-none ${
                      isDarkMode
                        ? 'bg-[#171A23] border-[#2A2F3C] text-gray-200'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <option value="cm">cm (Centimeter)</option>
                    <option value="mm">mm (Milimeter)</option>
                    <option value="m">m (Meter)</option>
                    <option value="px">px (Pixel)</option>
                  </select>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block mb-1">Resolusi (DPI)</span>
                  <select
                    value={dpi}
                    onChange={(e) =>
                      onUpdateDimensions({ dpi: parseInt(e.target.value, 10) as DpiType })
                    }
                    className={`w-full px-2 py-1.5 rounded border text-xs font-medium outline-none ${
                      isDarkMode
                        ? 'bg-[#171A23] border-[#2A2F3C] text-gray-200'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <option value="150">150 DPI (Outdoor/Banner)</option>
                    <option value="300">300 DPI (Indoor/Brosur)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. Pengaturan Pra-Cetak: Bleed & Safe Area */}
        <div
          className={`p-3 rounded-lg border space-y-2 text-xs ${
            isDarkMode ? 'bg-[#0F1117]/60 border-[#2A2F3C]' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-300 flex items-center gap-1.5">
              <span>Batas Pra-Cetak</span>
              <button
                type="button"
                onClick={() => setShowPrepressHelp(!showPrepressHelp)}
                className="text-gray-400 hover:text-indigo-400"
                title="Penjelasan Bleed dan Safe Area"
              >
                <HelpCircle size={13} />
              </button>
            </span>
            <span className="text-[10px] font-mono text-emerald-400">Standar Percetakan</span>
          </div>

          {showPrepressHelp && (
            <div className="text-[11px] text-gray-400 bg-indigo-950/30 border border-indigo-500/30 p-2 rounded leading-relaxed">
              <strong>Bleed (3mm):</strong> Area lebih potong luar agar tepi kertas tidak meninggalkan garis putih setelah dipotong pisau guillotine.<br/>
              <strong>Safe Area (5mm):</strong> Area aman dalam agar teks penting &amp; logo tidak terpotong saat proses finishing.
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <span className="text-[10px] text-gray-400 block mb-1">Bleed (mm)</span>
              <input
                type="number"
                min={0}
                max={20}
                value={bleedMm}
                onChange={(e) =>
                  onUpdateDimensions({ bleedMm: Math.max(0, parseFloat(e.target.value) || 0) })
                }
                className={`w-full px-2 py-1 rounded border text-xs font-mono outline-none ${
                  isDarkMode
                    ? 'bg-[#171A23] border-[#2A2F3C] text-gray-200'
                    : 'bg-white border-slate-200'
                }`}
              />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block mb-1">Safe Area (mm)</span>
              <input
                type="number"
                min={0}
                max={30}
                value={safeAreaMm}
                onChange={(e) =>
                  onUpdateDimensions({ safeAreaMm: Math.max(0, parseFloat(e.target.value) || 0) })
                }
                className={`w-full px-2 py-1 rounded border text-xs font-mono outline-none ${
                  isDarkMode
                    ? 'bg-[#171A23] border-[#2A2F3C] text-gray-200'
                    : 'bg-white border-slate-200'
                }`}
              />
            </div>
          </div>
        </div>

        {/* 4. Mode Input Desain */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Metode Input
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => onChangeInputMode('structured')}
              className={`p-2 rounded-lg border text-xs text-left transition-all ${
                inputMode === 'structured'
                  ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 font-semibold'
                  : isDarkMode
                  ? 'border-[#2A2F3C] bg-[#0F1117] text-gray-300'
                  : 'border-slate-200 bg-slate-50 text-slate-700'
              }`}
            >
              <div className="font-medium">Form Lengkap</div>
              <div className="text-[10px] text-gray-400">Teks terstruktur &amp; kontak</div>
            </button>
            <button
              type="button"
              onClick={() => onChangeInputMode('free')}
              className={`p-2 rounded-lg border text-xs text-left transition-all ${
                inputMode === 'free'
                  ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 font-semibold'
                  : isDarkMode
                  ? 'border-[#2A2F3C] bg-[#0F1117] text-gray-300'
                  : 'border-slate-200 bg-slate-50 text-slate-700'
              }`}
            >
              <div className="font-medium">Deskripsi Bebas</div>
              <div className="text-[10px] text-gray-400">Prompt teks leluasa</div>
            </button>
          </div>
        </div>

        {/* Input Details based on mode */}
        {inputMode === 'structured' ? (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-300">Detail Konten Desain</span>
              {businessProfile?.businessName && (
                <button
                  type="button"
                  onClick={onApplyBusinessProfile}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                >
                  <Building size={12} />
                  <span>Pakai Profil Usaha</span>
                </button>
              )}
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <input
                  type="text"
                  placeholder="Nama Usaha / Brand (contoh: Kopi Senja)"
                  value={structuredData.businessName}
                  onChange={(e) =>
                    onChangeStructuredData({ ...structuredData, businessName: e.target.value })
                  }
                  className={`w-full px-2.5 py-2 rounded-md border outline-none focus:ring-1 focus:ring-indigo-500 ${
                    isDarkMode ? 'bg-[#0F1117] border-[#2A2F3C]' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Judul Utama (contoh: GRAND OPENING DISKON 50%)"
                  value={structuredData.headline}
                  onChange={(e) =>
                    onChangeStructuredData({ ...structuredData, headline: e.target.value })
                  }
                  className={`w-full px-2.5 py-2 rounded-md border font-semibold outline-none focus:ring-1 focus:ring-indigo-500 ${
                    isDarkMode ? 'bg-[#0F1117] border-[#2A2F3C]' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Subjudul / Tagline (contoh: Sensasi Kopi Nusantara Asli)"
                  value={structuredData.subheadline}
                  onChange={(e) =>
                    onChangeStructuredData({ ...structuredData, subheadline: e.target.value })
                  }
                  className={`w-full px-2.5 py-2 rounded-md border outline-none focus:ring-1 focus:ring-indigo-500 ${
                    isDarkMode ? 'bg-[#0F1117] border-[#2A2F3C]' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div>
                <textarea
                  rows={2}
                  placeholder="Isi Teks / Keunggulan (pisahkan dengan koma atau baris baru)"
                  value={structuredData.bodyContent}
                  onChange={(e) =>
                    onChangeStructuredData({ ...structuredData, bodyContent: e.target.value })
                  }
                  className={`w-full px-2.5 py-2 rounded-md border outline-none focus:ring-1 focus:ring-indigo-500 resize-none ${
                    isDarkMode ? 'bg-[#0F1117] border-[#2A2F3C]' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Call to Action (Pesan Sekarang!)"
                  value={structuredData.callToAction}
                  onChange={(e) =>
                    onChangeStructuredData({ ...structuredData, callToAction: e.target.value })
                  }
                  className={`w-full px-2.5 py-2 rounded-md border outline-none ${
                    isDarkMode ? 'bg-[#0F1117] border-[#2A2F3C]' : 'bg-slate-50 border-slate-200'
                  }`}
                />
                <input
                  type="text"
                  placeholder="WhatsApp / HP"
                  value={structuredData.contactInfo}
                  onChange={(e) =>
                    onChangeStructuredData({ ...structuredData, contactInfo: e.target.value })
                  }
                  className={`w-full px-2.5 py-2 rounded-md border outline-none ${
                    isDarkMode ? 'bg-[#0F1117] border-[#2A2F3C]' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Alamat Toko / Lokasi"
                  value={structuredData.address}
                  onChange={(e) =>
                    onChangeStructuredData({ ...structuredData, address: e.target.value })
                  }
                  className={`w-full px-2.5 py-2 rounded-md border outline-none ${
                    isDarkMode ? 'bg-[#0F1117] border-[#2A2F3C]' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <span className="text-xs font-semibold text-gray-300">Deskripsi Desain yang Diinginkan</span>
            <textarea
              rows={4}
              placeholder="Jelaskan desain yang ingin dibuat... (contoh: Banner warung makan padang, judul 'RUMAH MAKAN SEDAP', warna dominan hijau dan merah, sertakan no WA dan daftar menu rendang & ayam pop)"
              value={description}
              onChange={(e) => onChangeDescription(e.target.value)}
              className={`w-full p-2.5 rounded-lg border text-xs outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed resize-none ${
                isDarkMode ? 'bg-[#0F1117] border-[#2A2F3C]' : 'bg-slate-50 border-slate-200'
              }`}
            />
            {/* Quick Inspiration Chips */}
            <div className="flex flex-wrap gap-1">
              {[
                'Promo Ramadhan 50%',
                'Standar Elegan Minimalis',
                'Pameran Expo Industri',
                'Menu Makanan & Minuman',
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() =>
                    onChangeDescription(
                      description ? `${description}, gaya ${chip}` : `Buatkan desain bertema ${chip}`
                    )
                  }
                  className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                    isDarkMode
                      ? 'border-[#2A2F3C] text-gray-400 hover:text-gray-200 hover:bg-[#0F1117]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  +{chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 5. Upload Logo & Foto Produk */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center justify-between">
            <span>Aset Gambar (Opsional)</span>
            <span className="text-[10px] text-gray-400 font-normal">PNG / JPG / SVG</span>
          </label>

          {uploadError && (
            <div className="text-[11px] text-red-400 flex items-center gap-1 bg-red-950/20 border border-red-500/30 p-2 rounded">
              <AlertCircle size={12} className="shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {/* Logo Upload Box */}
            <div
              onClick={() => logoInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-2.5 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[72px] ${
                uploadedLogo
                  ? 'border-indigo-500 bg-indigo-500/10'
                  : isDarkMode
                  ? 'border-[#2A2F3C] hover:border-gray-500 bg-[#0F1117]/40'
                  : 'border-slate-300 hover:border-slate-400 bg-slate-50'
              }`}
            >
              <input
                ref={logoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                onChange={(e) => handleFileUpload(e, 'logo')}
                className="hidden"
              />
              {uploadedLogo ? (
                <div className="flex flex-col items-center gap-1">
                  <img src={uploadedLogo} alt="Logo" className="h-8 max-w-[80px] object-contain" />
                  <span className="text-[10px] text-indigo-400 font-medium">Logo Terpasang</span>
                </div>
              ) : (
                <>
                  <Upload size={16} className="text-gray-400 mb-1" />
                  <span className="text-[11px] font-medium text-gray-300">Unggah Logo</span>
                </>
              )}
            </div>

            {/* Photo Upload Box */}
            <div
              onClick={() => photoInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-2.5 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[72px] ${
                uploadedPhoto
                  ? 'border-indigo-500 bg-indigo-500/10'
                  : isDarkMode
                  ? 'border-[#2A2F3C] hover:border-gray-500 bg-[#0F1117]/40'
                  : 'border-slate-300 hover:border-slate-400 bg-slate-50'
              }`}
            >
              <input
                ref={photoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                onChange={(e) => handleFileUpload(e, 'photo')}
                className="hidden"
              />
              {uploadedPhoto ? (
                <div className="flex flex-col items-center gap-1">
                  <img src={uploadedPhoto} alt="Foto" className="h-8 max-w-[80px] object-contain" />
                  <span className="text-[10px] text-indigo-400 font-medium">Foto Terpasang</span>
                </div>
              ) : (
                <>
                  <ImageIcon size={16} className="text-gray-400 mb-1" />
                  <span className="text-[11px] font-medium text-gray-300">Foto Produk</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 6. Gaya Desain */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Gaya Desain
          </label>
          <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
            {STYLE_OPTIONS.map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => onSelectStyle(st.id)}
                className={`p-2 rounded-lg border text-left text-xs transition-all ${
                  selectedStyle === st.id
                    ? 'border-indigo-500 bg-indigo-500/15 font-semibold text-indigo-400'
                    : isDarkMode
                    ? 'border-[#2A2F3C] bg-[#0F1117] text-gray-300 hover:border-gray-600'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-medium text-[11px] truncate">{st.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 7. Warna Utama Brand */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Warna Utama
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => onSelectColor(e.target.value)}
                className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                title="Pilih warna custom"
              />
              <span className="text-[10px] font-mono text-gray-400">{primaryColor}</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-1">
            {COLOR_PALETTES.map((pal) => (
              <button
                key={pal.name}
                type="button"
                onClick={() => onSelectColor(pal.hex)}
                title={pal.name}
                style={{ backgroundColor: pal.hex }}
                className={`w-7 h-7 rounded-md transition-transform shrink-0 ${
                  primaryColor.toLowerCase() === pal.hex.toLowerCase()
                    ? 'ring-2 ring-white ring-offset-2 scale-110'
                    : 'opacity-80 hover:opacity-100'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 8. Tombol Eksekusi: Generate & Variasi */}
        <div className="pt-2 space-y-2">
          <button
            type="button"
            disabled={isGenerating}
            onClick={onGenerate}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RotateCw size={16} className="animate-spin" />
                <span>{generationStatusText || 'Menyusun tata letak...'}</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Generate Desain (AI)</span>
              </>
            )}
          </button>

          <button
            type="button"
            disabled={isGenerating || !canMakeVariation}
            onClick={onMakeVariation}
            className={`w-full py-2 px-3 rounded-lg border font-semibold text-xs flex items-center justify-center gap-1.5 transition-all ${
              canMakeVariation
                ? isDarkMode
                  ? 'border-[#2A2F3C] hover:bg-[#2A2F3C] text-gray-200'
                  : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                : 'opacity-40 cursor-not-allowed border-transparent'
            }`}
            title="Buat versi komposisi lain dengan konten dan ukuran yang sama"
          >
            <RotateCw size={13} />
            <span>Buat Variasi Tata Letak</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
