/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DesignCategory, DesignStyle, StructuredFormData, BusinessProfile } from '../types/design';
import { calculatePrintDimensions, UnitType, DpiType } from './printCalc';

export interface DynamicGeneratorParams {
  category: DesignCategory;
  width: number;
  height: number;
  unit: UnitType;
  dpi?: DpiType;
  bleedMm?: number;
  safeAreaMm?: number;
  description?: string;
  style?: DesignStyle;
  primaryColor?: string;
  structuredData?: StructuredFormData;
  businessProfile?: BusinessProfile | null;
  uploadedLogo?: string | null;
  uploadedPhoto?: string | null;
  isVariation?: boolean;
}

export interface DynamicGeneratorResult {
  svg: string;
  conceptNote: string;
  fontAndPaletteAdvice: string;
}

/**
 * Mesin Generator Vektor SVG Cerdas Pra-Cetak
 * Menghasilkan SVG berkualitas tinggi berdasarkan dimensi tepat, gaya, warna, dan data teks pengguna.
 */
export function generateDynamicVectorDesign(params: DynamicGeneratorParams): DynamicGeneratorResult {
  const {
    category,
    width,
    height,
    unit,
    dpi = 300,
    bleedMm = 3,
    safeAreaMm = 5,
    description = '',
    style = 'modern',
    primaryColor = '#4F46E5',
    structuredData,
    businessProfile,
    uploadedLogo,
    uploadedPhoto,
    isVariation = false,
  } = params;

  const dim = calculatePrintDimensions({
    width,
    height,
    unit,
    dpi,
    bleedMm,
    safeAreaMm,
  });

  // Tentukan rasio aspek & orientasi
  const isLandscape = dim.widthMm >= dim.heightMm;
  const vbW = isLandscape ? 3000 : 1200;
  const vbH = Math.round(vbW * (dim.heightMm / dim.widthMm));

  // Tentukan teks konten
  const brandName =
    structuredData?.businessName ||
    businessProfile?.businessName ||
    'PRINTSTUDIO PRO';

  let headline =
    structuredData?.headline ||
    (description ? description.slice(0, 40).toUpperCase() : '') ||
    'PERCETAKAN DIGITAL CEPAT';

  let subheadline =
    structuredData?.subheadline ||
    businessProfile?.tagline ||
    'Spanduk • Brosur • Kartu Nama • Stiker • Hasil Tajam Siap Cetak';

  let bodyContent =
    structuredData?.bodyContent ||
    'Bahan Berkualitas Tinggi • Warna Tajam Tahan Lama • Pengerjaan Kilat';

  let cta = structuredData?.callToAction || 'HUBUNGI KAMI SEKARANG:';
  let phone = structuredData?.contactInfo || businessProfile?.phone || 'WhatsApp: 0812-3456-7890';
  let address = structuredData?.address || businessProfile?.address || 'Jl. Percetakan Raya No. 88';

  // Sesuaikan palet sekunder berdasarkan gaya
  let secondaryColor = '#38BDF8';
  let darkBg1 = '#0F172A';
  let darkBg2 = '#1E1B4B';
  let accentGrad = '#F59E0B';

  if (style === 'elegan') {
    primaryColor;
    secondaryColor = '#D4AF37'; // gold
    darkBg1 = '#090D16';
    darkBg2 = '#1A1829';
    accentGrad = '#FBBF24';
  } else if (style === 'ceria') {
    secondaryColor = '#F43F5E';
    darkBg1 = '#1E1B4B';
    darkBg2 = '#311042';
    accentGrad = '#EC4899';
  } else if (style === 'islami') {
    secondaryColor = '#10B981';
    darkBg1 = '#06281E';
    darkBg2 = '#0B1E19';
    accentGrad = '#F59E0B';
  } else if (style === 'industrial') {
    secondaryColor = '#EAB308';
    darkBg1 = '#18181B';
    darkBg2 = '#09090B';
    accentGrad = '#CA8A04';
  }

  // Desain Variasi Komposisi Alternatif
  const useVariantComposition = isVariation;

  // Ukuran font adaptif proporsional dengan tinggi kanvas
  const headlineFontSize = Math.max(28, Math.round(vbH * 0.12));
  const subheadFontSize = Math.max(16, Math.round(vbH * 0.05));
  const bodyFontSize = Math.max(14, Math.round(vbH * 0.038));
  const contactFontSize = Math.max(14, Math.round(vbH * 0.042));
  const badgeFontSize = Math.max(12, Math.round(vbH * 0.035));

  // Area Aman (Safe Area) dalam koordinat viewBox
  const safeMarginX = Math.round(vbW * 0.06);
  const safeMarginY = Math.round(vbH * 0.08);

  let svgContent = '';

  if (isLandscape) {
    if (!useVariantComposition) {
      // Komposisi Landscape 1: Diagonal Bold dengan Accent Slash
      svgContent = `
  <!-- Latar Belakang Gradien -->
  <rect id="background" width="${vbW}" height="${vbH}" fill="url(#bgGrad)"/>
  
  <!-- Bentuk Dekorasi Geometris -->
  <path id="decor-shape-1" d="M0,0 L${Math.round(vbW * 0.4)},0 L${Math.round(vbW * 0.3)},${vbH} L0,${vbH} Z" fill="#ffffff" opacity="0.04"/>
  <circle id="decor-circle" cx="${Math.round(vbW * 0.85)}" cy="${Math.round(vbH * 0.5)}" r="${Math.round(vbH * 0.45)}" fill="${primaryColor}" opacity="0.25"/>
  <path id="accent-slash" d="M${Math.round(vbW * 0.72)},0 L${Math.round(vbW * 0.8)},0 L${Math.round(vbW * 0.67)},${vbH} L${Math.round(vbW * 0.59)},${vbH} Z" fill="url(#accentGrad)" opacity="0.85"/>

  <!-- Logo jika ada -->
  ${
    uploadedLogo
      ? `<image id="logo-uploaded" href="${uploadedLogo}" x="${safeMarginX}" y="${safeMarginY}" width="${Math.round(vbH * 0.2)}" height="${Math.round(vbH * 0.2)}" preserveAspectRatio="xMidYMid meet"/>`
      : ''
  }

  <!-- Badge Promo / Kategori -->
  <g id="badge-top" transform="translate(${uploadedLogo ? safeMarginX + Math.round(vbH * 0.24) : safeMarginX}, ${safeMarginY})">
    <rect width="${Math.round(vbW * 0.16)}" height="${Math.round(vbH * 0.09)}" rx="${Math.round(vbH * 0.045)}" fill="url(#accentGrad)"/>
    <text x="${Math.round(vbW * 0.08)}" y="${Math.round(vbH * 0.058)}" font-family="'Montserrat', sans-serif" font-size="${badgeFontSize}" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">PROMO SPESIAL</text>
  </g>

  <!-- Judul Utama -->
  <text id="headline" x="${safeMarginX}" y="${Math.round(vbH * 0.42)}" font-family="'Montserrat', sans-serif" font-size="${headlineFontSize}" font-weight="900" fill="#FFFFFF" letter-spacing="-1">
    ${headline}
  </text>

  <!-- Subjudul -->
  <text id="subheadline" x="${safeMarginX}" y="${Math.round(vbH * 0.54)}" font-family="'Montserrat', sans-serif" font-size="${subheadFontSize}" font-weight="600" fill="#F1F5F9" opacity="0.95">
    ${subheadline}
  </text>

  <!-- Poin Fitur / Isi -->
  <text id="body-text" x="${safeMarginX}" y="${Math.round(vbH * 0.65)}" font-family="'Montserrat', sans-serif" font-size="${bodyFontSize}" font-weight="500" fill="#CBD5E1">
    ${bodyContent}
  </text>

  <!-- Bar Kontak & Panggilan Aksi (CTA) Bawah -->
  <g id="contact-bar" transform="translate(${safeMarginX}, ${Math.round(vbH * 0.77)})">
    <rect width="${vbW - safeMarginX * 2}" height="${Math.round(vbH * 0.15)}" rx="18" fill="#090D16" opacity="0.75" stroke="#334155" stroke-width="2"/>
    <text id="cta-label" x="${Math.round(vbW * 0.02)}" y="${Math.round(vbH * 0.095)}" font-family="'Montserrat', sans-serif" font-size="${contactFontSize}" font-weight="800" fill="${accentGrad}">${cta}</text>
    <text id="contact-phone" x="${Math.round(vbW * 0.3)}" y="${Math.round(vbH * 0.095)}" font-family="'Montserrat', sans-serif" font-size="${contactFontSize}" font-weight="700" fill="#FFFFFF">${phone}</text>
    <text id="contact-address" x="${Math.round(vbW * 0.62)}" y="${Math.round(vbH * 0.095)}" font-family="'Montserrat', sans-serif" font-size="${Math.round(contactFontSize * 0.9)}" font-weight="500" fill="#94A3B8">${address}</text>
  </g>`;
    } else {
      // Komposisi Landscape 2 (Variasi): Centered Grid dengan Side Badge
      svgContent = `
  <!-- Latar Belakang Gradien Variasi -->
  <rect id="background" width="${vbW}" height="${vbH}" fill="url(#bgGradVariant)"/>

  <!-- Ornamen Sisi Kanan -->
  <rect id="side-card" x="${Math.round(vbW * 0.65)}" y="0" width="${Math.round(vbW * 0.35)}" height="${vbH}" fill="${primaryColor}" opacity="0.2"/>
  <circle cx="${Math.round(vbW * 0.8)}" cy="${Math.round(vbH * 0.5)}" r="${Math.round(vbH * 0.38)}" fill="none" stroke="${secondaryColor}" stroke-width="4" stroke-dasharray="16,8" opacity="0.4"/>

  <!-- Brand Name Pill -->
  <g id="brand-tag" transform="translate(${safeMarginX}, ${safeMarginY})">
    <rect width="${Math.round(vbW * 0.25)}" height="${Math.round(vbH * 0.08)}" rx="8" fill="${primaryColor}" opacity="0.3" stroke="${primaryColor}" stroke-width="2"/>
    <text x="16" y="${Math.round(vbH * 0.052)}" font-family="'Montserrat', sans-serif" font-size="${badgeFontSize}" font-weight="800" fill="#FFFFFF" letter-spacing="2">${brandName}</text>
  </g>

  <!-- Judul Utama (Kiri Terfokus) -->
  <text id="headline" x="${safeMarginX}" y="${Math.round(vbH * 0.38)}" font-family="'Montserrat', sans-serif" font-size="${Math.round(headlineFontSize * 1.1)}" font-weight="900" fill="#FFFFFF">
    ${headline}
  </text>

  <!-- Garis Aksen -->
  <rect id="accent-line" x="${safeMarginX}" y="${Math.round(vbH * 0.44)}" width="${Math.round(vbW * 0.15)}" height="6" rx="3" fill="${secondaryColor}"/>

  <!-- Subjudul -->
  <text id="subheadline" x="${safeMarginX}" y="${Math.round(vbH * 0.53)}" font-family="'Montserrat', sans-serif" font-size="${subheadFontSize}" font-weight="600" fill="#E2E8F0">
    ${subheadline}
  </text>

  <!-- Poin Layanan -->
  <text id="body-text" x="${safeMarginX}" y="${Math.round(vbH * 0.64)}" font-family="'Montserrat', sans-serif" font-size="${bodyFontSize}" font-weight="400" fill="#94A3B8">
    ${bodyContent}
  </text>

  <!-- Tombol CTA & Kontak Terpisah -->
  <g id="cta-button" transform="translate(${safeMarginX}, ${Math.round(vbH * 0.74)})">
    <rect width="${Math.round(vbW * 0.22)}" height="${Math.round(vbH * 0.14)}" rx="14" fill="url(#accentGrad)"/>
    <text x="${Math.round(vbW * 0.11)}" y="${Math.round(vbH * 0.085)}" font-family="'Montserrat', sans-serif" font-size="${contactFontSize}" font-weight="800" fill="#FFFFFF" text-anchor="middle">${cta}</text>
  </g>

  <g id="contact-info" transform="translate(${safeMarginX + Math.round(vbW * 0.25)}, ${Math.round(vbH * 0.74)})">
    <text x="0" y="${Math.round(vbH * 0.06)}" font-family="'Montserrat', sans-serif" font-size="${contactFontSize}" font-weight="700" fill="#FFFFFF">${phone}</text>
    <text x="0" y="${Math.round(vbH * 0.11)}" font-family="'Montserrat', sans-serif" font-size="${Math.round(contactFontSize * 0.85)}" font-weight="500" fill="#94A3B8">${address}</text>
  </g>`;
    }
  } else {
    // Komposisi Portrait / Vertikal (Roll-Up, X-Banner, Poster, Flyer)
    svgContent = `
  <!-- Latar Belakang Vertikal -->
  <rect id="background" width="${vbW}" height="${vbH}" fill="url(#bgGrad)"/>

  <!-- Ornamen Atas & Bawah -->
  <path d="M0,0 Q${Math.round(vbW * 0.5)},${Math.round(vbH * 0.15)} ${vbW},0 L${vbW},0 Z" fill="${primaryColor}" opacity="0.3"/>
  <circle cx="${Math.round(vbW * 0.9)}" cy="${Math.round(vbH * 0.25)}" r="${Math.round(vbW * 0.35)}" fill="${secondaryColor}" opacity="0.12"/>
  <circle cx="${Math.round(vbW * 0.1)}" cy="${Math.round(vbH * 0.85)}" r="${Math.round(vbW * 0.3)}" fill="${primaryColor}" opacity="0.2"/>

  <!-- Header Brand & Logo -->
  <g id="header-brand" transform="translate(${safeMarginX}, ${safeMarginY})">
    <circle cx="28" cy="28" r="28" fill="${primaryColor}"/>
    <text x="70" y="36" font-family="'Montserrat', sans-serif" font-size="${Math.round(subheadFontSize * 0.9)}" font-weight="800" fill="#FFFFFF" letter-spacing="2">${brandName}</text>
  </g>

  <!-- Badge Highlight -->
  <g id="badge-top" transform="translate(${safeMarginX}, ${Math.round(vbH * 0.12)})">
    <rect width="${Math.round(vbW * 0.45)}" height="${Math.round(vbH * 0.035)}" rx="${Math.round(vbH * 0.017)}" fill="url(#accentGrad)"/>
    <text x="${Math.round(vbW * 0.225)}" y="${Math.round(vbH * 0.024)}" font-family="'Montserrat', sans-serif" font-size="${badgeFontSize}" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">PREMIUM PRINTING</text>
  </g>

  <!-- Judul Utama Vertikal -->
  <text id="headline" x="${safeMarginX}" y="${Math.round(vbH * 0.24)}" font-family="'Montserrat', sans-serif" font-size="${headlineFontSize}" font-weight="900" fill="#FFFFFF">
    ${headline}
  </text>

  <!-- Subjudul -->
  <text id="subheadline" x="${safeMarginX}" y="${Math.round(vbH * 0.33)}" font-family="'Montserrat', sans-serif" font-size="${subheadFontSize}" font-weight="600" fill="${secondaryColor}">
    ${subheadline}
  </text>

  <!-- 3 Kotak Keunggulan Vertikal -->
  <g id="feature-box-1" transform="translate(${safeMarginX}, ${Math.round(vbH * 0.4)})">
    <rect width="${vbW - safeMarginX * 2}" height="${Math.round(vbH * 0.09)}" rx="14" fill="#1E293B" stroke="#334155" stroke-width="1.5"/>
    <circle cx="${Math.round(vbW * 0.06)}" cy="${Math.round(vbH * 0.045)}" r="${Math.round(vbH * 0.022)}" fill="${primaryColor}"/>
    <text x="${Math.round(vbW * 0.13)}" y="${Math.round(vbH * 0.042)}" font-family="'Montserrat', sans-serif" font-size="${bodyFontSize}" font-weight="700" fill="#FFFFFF">Bahan Tebal &amp; Awet</text>
    <text x="${Math.round(vbW * 0.13)}" y="${Math.round(vbH * 0.065)}" font-family="'Montserrat', sans-serif" font-size="${Math.round(bodyFontSize * 0.75)}" font-weight="400" fill="#94A3B8">Kualitas cetak anti pudar outdoor/indoor</text>
  </g>

  <g id="feature-box-2" transform="translate(${safeMarginX}, ${Math.round(vbH * 0.51)})">
    <rect width="${vbW - safeMarginX * 2}" height="${Math.round(vbH * 0.09)}" rx="14" fill="#1E293B" stroke="#334155" stroke-width="1.5"/>
    <circle cx="${Math.round(vbW * 0.06)}" cy="${Math.round(vbH * 0.045)}" r="${Math.round(vbH * 0.022)}" fill="${secondaryColor}"/>
    <text x="${Math.round(vbW * 0.13)}" y="${Math.round(vbH * 0.042)}" font-family="'Montserrat', sans-serif" font-size="${bodyFontSize}" font-weight="700" fill="#FFFFFF">Resolusi Vektor Tajam</text>
    <text x="${Math.round(vbW * 0.13)}" y="${Math.round(vbH * 0.065)}" font-family="'Montserrat', sans-serif" font-size="${Math.round(bodyFontSize * 0.75)}" font-weight="400" fill="#94A3B8">Garis potong bleed &amp; safe margin presisi</text>
  </g>

  <g id="feature-box-3" transform="translate(${safeMarginX}, ${Math.round(vbH * 0.62)})">
    <rect width="${vbW - safeMarginX * 2}" height="${Math.round(vbH * 0.09)}" rx="14" fill="#1E293B" stroke="#334155" stroke-width="1.5"/>
    <circle cx="${Math.round(vbW * 0.06)}" cy="${Math.round(vbH * 0.045)}" r="${Math.round(vbH * 0.022)}" fill="#10B981"/>
    <text x="${Math.round(vbW * 0.13)}" y="${Math.round(vbH * 0.042)}" font-family="'Montserrat', sans-serif" font-size="${bodyFontSize}" font-weight="700" fill="#FFFFFF">Pengerjaan Tepat Waktu</text>
    <text x="${Math.round(vbW * 0.13)}" y="${Math.round(vbH * 0.065)}" font-family="'Montserrat', sans-serif" font-size="${Math.round(bodyFontSize * 0.75)}" font-weight="400" fill="#94A3B8">Siap kirim ke seluruh kota Indonesia</text>
  </g>

  <!-- Panggilan Aksi & Kontak Bawah -->
  <g id="bottom-cta" transform="translate(${safeMarginX}, ${Math.round(vbH * 0.75)})">
    <rect width="${vbW - safeMarginX * 2}" height="${Math.round(vbH * 0.17)}" rx="20" fill="url(#accentGrad)"/>
    <text x="${Math.round((vbW - safeMarginX * 2) / 2)}" y="${Math.round(vbH * 0.045)}" font-family="'Montserrat', sans-serif" font-size="${contactFontSize}" font-weight="900" fill="#FFFFFF" text-anchor="middle">${cta}</text>
    
    <rect x="${Math.round(vbW * 0.05)}" y="${Math.round(vbH * 0.07)}" width="${vbW - safeMarginX * 2 - Math.round(vbW * 0.1)}" height="${Math.round(vbH * 0.05)}" rx="12" fill="#FFFFFF"/>
    <text x="${Math.round((vbW - safeMarginX * 2) / 2)}" y="${Math.round(vbH * 0.103)}" font-family="'Montserrat', sans-serif" font-size="${Math.round(contactFontSize * 0.9)}" font-weight="800" fill="#0F172A" text-anchor="middle">${phone}</text>

    <text x="${Math.round((vbW - safeMarginX * 2) / 2)}" y="${Math.round(vbH * 0.148)}" font-family="'Montserrat', sans-serif" font-size="${Math.round(bodyFontSize * 0.75)}" font-weight="600" fill="#FFFFFF" text-anchor="middle">${address}</text>
  </g>`;
  }

  const finalSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vbW} ${vbH}" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${darkBg1}"/>
      <stop offset="60%" stop-color="${primaryColor}"/>
      <stop offset="100%" stop-color="${darkBg2}"/>
    </linearGradient>
    <linearGradient id="bgGradVariant" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${darkBg2}"/>
      <stop offset="50%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="${darkBg1}"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${accentGrad}"/>
      <stop offset="100%" stop-color="${secondaryColor}"/>
    </linearGradient>
  </defs>

  ${svgContent}
</svg>`;

  const conceptNote = isVariation
    ? `Variasi komposisi alternatif ${category} (${width}x${height} ${unit}) bergaya ${style} dengan tata letak segar.`
    : `Desain siap cetak ${category} (${width}x${height} ${unit}) dengan batas potong bleed ${bleedMm}mm dan safe area ${safeAreaMm}mm.`;

  const fontAndPaletteAdvice = `Font: Montserrat | Palet: ${primaryColor}, ${darkBg1}, ${secondaryColor}, ${accentGrad}`;

  return {
    svg: finalSvg,
    conceptNote,
    fontAndPaletteAdvice,
  };
}
