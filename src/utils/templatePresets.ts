/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DesignCategory, SizePreset, DesignStyle } from '../types/design';

export interface CategoryOption {
  id: DesignCategory;
  name: string;
  description: string;
  iconName: string;
}

export const DESIGN_CATEGORIES: CategoryOption[] = [
  {
    id: 'banner',
    name: 'Spanduk / Banner / Baliho',
    description: 'Outdoor & indoor flexi, promosi toko, event, pilkada, dan baliho besar',
    iconName: 'Flag',
  },
  {
    id: 'xbanner',
    name: 'X-Banner',
    description: 'Banner berdiri dengan rangka silang X, ringan dan praktis',
    iconName: 'Maximize2',
  },
  {
    id: 'rollup',
    name: 'Roll-Up Banner',
    description: 'Display pameran premium dengan mekanisme gulung otomatis',
    iconName: 'Scroll',
  },
  {
    id: 'flyer',
    name: 'Brosur / Flyer / Leaflet',
    description: 'Promosi produk, brosur lipat, dan selebaran A4, A5, DL',
    iconName: 'FileText',
  },
  {
    id: 'businesscard',
    name: 'Kartu Nama',
    description: 'Identitas profesional standar 9 x 5,5 cm dengan safe margin presisi',
    iconName: 'CreditCard',
  },
  {
    id: 'sticker',
    name: 'Stiker & Label Produk',
    description: 'Label kemasan makanan, stiker die-cut bulat atau kotak',
    iconName: 'Tag',
  },
  {
    id: 'poster',
    name: 'Poster Cetak',
    description: 'Poster acara musik, seminar, pengumuman, dan dekorasi dinding',
    iconName: 'Image',
  },
  {
    id: 'invitation',
    name: 'Undangan Acara',
    description: 'Undangan pernikahan, khitanan, ulang tahun, dan gathering resmi',
    iconName: 'Mail',
  },
  {
    id: 'tshirt',
    name: 'Desain Kaos / Sablon',
    description: 'Vektor sablon DTF/plastisol area dada, punggung, atau pocket',
    iconName: 'Shirt',
  },
  {
    id: 'packaging',
    name: 'Kemasan / Packaging',
    description: 'Kotak kue, sleeve kemasan, standing pouch, dan paper bag',
    iconName: 'Package',
  },
];

export const SIZE_PRESETS: SizePreset[] = [
  // Banner & Baliho
  {
    id: 'banner_3x1',
    category: 'banner',
    name: 'Spanduk 3 x 1 Meter',
    width: 300,
    height: 100,
    unit: 'cm',
    description: 'Standar warung, toko ritel, dan promo pinggir jalan (Luas 3 m²)',
    defaultDpi: 150,
  },
  {
    id: 'banner_2x1',
    category: 'banner',
    name: 'Spanduk 2 x 1 Meter',
    width: 200,
    height: 100,
    unit: 'cm',
    description: 'Ukuran kompak pagar ruko dan stan pameran (Luas 2 m²)',
    defaultDpi: 150,
  },
  {
    id: 'banner_4x1',
    category: 'banner',
    name: 'Spanduk 4 x 1 Meter',
    width: 400,
    height: 100,
    unit: 'cm',
    description: 'Ukuran panjang melintang untuk jalan raya (Luas 4 m²)',
    defaultDpi: 150,
  },
  {
    id: 'banner_5x2',
    category: 'banner',
    name: 'Baliho / Billboard 5 x 2 Meter',
    width: 500,
    height: 200,
    unit: 'cm',
    description: 'Baliho besar jalan protokol dan gedung (Luas 10 m²)',
    defaultDpi: 150,
  },

  // X-Banner
  {
    id: 'xbanner_60x160',
    category: 'xbanner',
    name: 'X-Banner 60 x 160 cm',
    width: 60,
    height: 160,
    unit: 'cm',
    description: 'Ukuran paling populer untuk depan pintu toko dan seminar',
    defaultDpi: 150,
  },
  {
    id: 'xbanner_80x180',
    category: 'xbanner',
    name: 'X-Banner 80 x 180 cm',
    width: 80,
    height: 180,
    unit: 'cm',
    description: 'Ukuran jumbo untuk visibilitas tinggi di lobi gedung',
    defaultDpi: 150,
  },

  // Roll-Up Banner
  {
    id: 'rollup_85x200',
    category: 'rollup',
    name: 'Roll-Up 85 x 200 cm',
    width: 85,
    height: 200,
    unit: 'cm',
    description: 'Standar internasional display alumunium roll-up',
    defaultDpi: 150,
  },
  {
    id: 'rollup_60x160',
    category: 'rollup',
    name: 'Roll-Up 60 x 160 cm',
    width: 60,
    height: 160,
    unit: 'cm',
    description: 'Roll-up mini hemat tempat untuk stan kecil',
    defaultDpi: 150,
  },

  // Flyer / Brosur
  {
    id: 'flyer_a4',
    category: 'flyer',
    name: 'Brosur A4 (21 x 29.7 cm)',
    width: 21,
    height: 29.7,
    unit: 'cm',
    description: 'Standar brosur 1 lembar atau lipat 3 (trifold)',
    defaultDpi: 300,
  },
  {
    id: 'flyer_a5',
    category: 'flyer',
    name: 'Flyer A5 (14.8 x 21 cm)',
    width: 14.8,
    height: 21,
    unit: 'cm',
    description: 'Ukuran selebaran praktis hemat kertas',
    defaultDpi: 300,
  },
  {
    id: 'flyer_dl',
    category: 'flyer',
    name: 'Brosur DL (9.9 x 21 cm)',
    width: 9.9,
    height: 21,
    unit: 'cm',
    description: 'Brosur ramping vertikal pas untuk amplop bisnis',
    defaultDpi: 300,
  },

  // Kartu Nama
  {
    id: 'card_id_std',
    category: 'businesscard',
    name: 'Kartu Nama Standar (9 x 5.5 cm)',
    width: 9,
    height: 5.5,
    unit: 'cm',
    description: 'Ukuran baku percetakan Indonesia & Asia',
    defaultDpi: 300,
  },
  {
    id: 'card_intl',
    category: 'businesscard',
    name: 'Kartu Nama Internasional (8.5 x 5.5 cm)',
    width: 8.5,
    height: 5.5,
    unit: 'cm',
    description: 'Ukuran kartu kredit / standar Eropa & AS',
    defaultDpi: 300,
  },

  // Stiker
  {
    id: 'sticker_round_5',
    category: 'sticker',
    name: 'Stiker Bulat 5 cm',
    width: 5,
    height: 5,
    unit: 'cm',
    description: 'Label tutup cup kopi, toples cookies, dan boks makanan',
    defaultDpi: 300,
  },
  {
    id: 'sticker_rect_7x4',
    category: 'sticker',
    name: 'Stiker Kotak 7 x 4 cm',
    width: 7,
    height: 4,
    unit: 'cm',
    description: 'Label botol minuman, pouch snack, dan frozen food',
    defaultDpi: 300,
  },
  {
    id: 'sticker_square_5',
    category: 'sticker',
    name: 'Stiker Kotak 5 x 5 cm',
    width: 5,
    height: 5,
    unit: 'cm',
    description: 'Stiker persegi serbaguna dengan sudut rounded',
    defaultDpi: 300,
  },

  // Poster
  {
    id: 'poster_a3',
    category: 'poster',
    name: 'Poster A3 (29.7 x 42 cm)',
    width: 29.7,
    height: 42,
    unit: 'cm',
    description: 'Cetak mesin digital A3+ populer untuk dinding & mading',
    defaultDpi: 300,
  },
  {
    id: 'poster_a2',
    category: 'poster',
    name: 'Poster A2 (42 x 59.4 cm)',
    width: 42,
    height: 59.4,
    unit: 'cm',
    description: 'Poster besar promosi bioskop, konser, dan seminar',
    defaultDpi: 300,
  },

  // Undangan
  {
    id: 'invite_15x20',
    category: 'invitation',
    name: 'Undangan 15 x 20 cm',
    width: 15,
    height: 20,
    unit: 'cm',
    description: 'Format single card elegan untuk pernikahan & gala',
    defaultDpi: 300,
  },
  {
    id: 'invite_10x20',
    category: 'invitation',
    name: 'Undangan Slim (10 x 20 cm)',
    width: 10,
    height: 20,
    unit: 'cm',
    description: 'Format modern ramping pas amplop panjang',
    defaultDpi: 300,
  },

  // Kaos / Sablon
  {
    id: 'tshirt_front_a3',
    category: 'tshirt',
    name: 'Kaos Area Depan A3 (30 x 42 cm)',
    width: 30,
    height: 42,
    unit: 'cm',
    description: 'Area cetak sablon dada penuh DTF atau sablon manual',
    defaultDpi: 300,
  },
  {
    id: 'tshirt_front_a4',
    category: 'tshirt',
    name: 'Kaos Area Depan A4 (21 x 30 cm)',
    width: 21,
    height: 30,
    unit: 'cm',
    description: 'Area cetak grafis dada tengah proporsional',
    defaultDpi: 300,
  },
  {
    id: 'tshirt_pocket',
    category: 'tshirt',
    name: 'Kaos Dada Kiri / Saku (10 x 10 cm)',
    width: 10,
    height: 10,
    unit: 'cm',
    description: 'Logo dada kiri seragam atau kaos komunitas',
    defaultDpi: 300,
  },

  // Kemasan
  {
    id: 'pack_box_sleeve',
    category: 'packaging',
    name: 'Sleeve Boks Makanan (45 x 12 cm)',
    width: 45,
    height: 12,
    unit: 'cm',
    description: 'Sabuk melingkar boks kraft nasi/kue/catering',
    defaultDpi: 300,
  },
  {
    id: 'pack_pouch_250',
    category: 'packaging',
    name: 'Standing Pouch 250g (14 x 22 cm)',
    width: 14,
    height: 22,
    unit: 'cm',
    description: 'Kemasan kopi bubuk, keripik, dan camilan premium',
    defaultDpi: 300,
  },
];

export const STYLE_OPTIONS: { id: DesignStyle; name: string; description: string; previewBadge: string }[] = [
  {
    id: 'modern',
    name: 'Modern & Dinamis',
    description: 'Garis tegas, bentuk geometris kontemporer, kontras tinggi dan eye-catching',
    previewBadge: 'bg-indigo-600 text-white',
  },
  {
    id: 'minimalis',
    name: 'Minimalis & Bersih',
    description: 'Ruang negatif lega, tipografi sans-serif elegan, fokus pada pesan inti',
    previewBadge: 'bg-slate-700 text-white',
  },
  {
    id: 'elegan',
    name: 'Elegan & Mewah',
    description: 'Aksen emas/perak, warna gelap dalam, font serif mewah dan berkelas',
    previewBadge: 'bg-amber-600 text-white',
  },
  {
    id: 'ceria',
    name: 'Ceria & Playful',
    description: 'Warna-warni cerah, kurva ramah, cocok untuk kuliner, anak, dan festival',
    previewBadge: 'bg-pink-600 text-white',
  },
  {
    id: 'korporat',
    name: 'Korporat & Profesional',
    description: 'Nuansa biru navy tepercaya, rapi, terstruktur, ideal untuk instansi & B2B',
    previewBadge: 'bg-blue-700 text-white',
  },
  {
    id: 'retro',
    name: 'Retro & Vintage',
    description: 'Nuansa nostalgia klasik, lencana stempel, font slab serif dan tekstur hangat',
    previewBadge: 'bg-orange-700 text-white',
  },
  {
    id: 'islami',
    name: 'Islami & Tradisional',
    description: 'Ornamen arabeska, kubah halus, hijau zamrud & emas untuk Ramadhan/idul fitri',
    previewBadge: 'bg-emerald-700 text-white',
  },
  {
    id: 'industrial',
    name: 'Industrial & Bold',
    description: 'Font tebal sans-serif, aksen kuning hazard/hitam, energik dan berani',
    previewBadge: 'bg-yellow-600 text-black',
  },
];

export const COLOR_PALETTES = [
  { name: 'Indigo Studio', hex: '#4F46E5', secondary: '#EEF2FF', text: '#FFFFFF' },
  { name: 'Royal Sapphire', hex: '#1D4ED8', secondary: '#DBEAFE', text: '#FFFFFF' },
  { name: 'Emerald Percetakan', hex: '#059669', secondary: '#D1FAE5', text: '#FFFFFF' },
  { name: 'Crimson Promo', hex: '#DC2626', secondary: '#FEE2E2', text: '#FFFFFF' },
  { name: 'Amber Gold', hex: '#D97706', secondary: '#FEF3C7', text: '#111827' },
  { name: 'Purple Luxury', hex: '#7C3AED', secondary: '#EDE9FE', text: '#FFFFFF' },
  { name: 'Rose Blossom', hex: '#E11D48', secondary: '#FFE4E6', text: '#FFFFFF' },
  { name: 'Monochrome Dark', hex: '#0F172A', secondary: '#F1F5F9', text: '#FFFFFF' },
];

/**
 * Starter Vector SVG Template Factory
 */
export function getStarterTemplate(category: DesignCategory, width: number, height: number, primaryColor: string = '#4F46E5'): string {
  // Hitung aspek rasio
  const w = Math.round(width * 10);
  const h = Math.round(height * 10);

  if (category === 'banner') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3000 1000" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="50%" stop-color="${primaryColor}"/>
      <stop offset="100%" stop-color="#090D16"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#EF4444"/>
    </linearGradient>
    <filter id="dropShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-opacity="0.5"/>
    </filter>
  </defs>

  <!-- Latar Belakang -->
  <rect id="background" width="3000" height="1000" fill="url(#bgGrad)"/>

  <!-- Bentuk Dekorasi Geometris -->
  <path id="accent-shape-1" d="M0,0 L1200,0 L900,1000 L0,1000 Z" fill="#ffffff" opacity="0.04"/>
  <circle id="accent-circle" cx="2600" cy="500" r="450" fill="${primaryColor}" opacity="0.3"/>
  <path id="accent-slash" d="M2200,0 L2450,0 L2050,1000 L1800,1000 Z" fill="url(#accentGrad)" opacity="0.85"/>

  <!-- Badge Diskon / Promo -->
  <g id="badge-promo" transform="translate(180, 160)">
    <rect width="480" height="90" rx="45" fill="url(#accentGrad)" filter="url(#dropShadow)"/>
    <text x="240" y="58" font-family="'Montserrat', sans-serif" font-size="40" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="4">PROMO SPESIAL</text>
  </g>

  <!-- Judul Utama (Terbaca Jelas dari Jarak Jauh) -->
  <text id="headline" x="180" y="420" font-family="'Montserrat', sans-serif" font-size="130" font-weight="900" fill="#FFFFFF" letter-spacing="-1">
    PERCETAKAN DIGITAL CEPAT
  </text>

  <!-- Subjudul Deskripsi -->
  <text id="subheadline" x="180" y="540" font-family="'Montserrat', sans-serif" font-size="52" font-weight="600" fill="#F1F5F9" opacity="0.95">
    Spanduk • Brosur • Kartu Nama • Stiker • Hasil Tajam Siap Cetak
  </text>

  <!-- Poin Keunggulan -->
  <g id="features" transform="translate(180, 640)">
    <circle cx="20" cy="20" r="14" fill="#22C55E"/>
    <text x="50" y="32" font-family="'Montserrat', sans-serif" font-size="38" font-weight="600" fill="#E2E8F0">Pengerjaan 1 Hari</text>
    <circle cx="520" cy="20" r="14" fill="#22C55E"/>
    <text x="550" y="32" font-family="'Montserrat', sans-serif" font-size="38" font-weight="600" fill="#E2E8F0">Bahan Flexi Korea 440g</text>
    <circle cx="1180" cy="20" r="14" fill="#22C55E"/>
    <text x="1210" y="32" font-family="'Montserrat', sans-serif" font-size="38" font-weight="600" fill="#E2E8F0">Gratis Finishing Mata Ayam</text>
  </g>

  <!-- Area Kontak & Panggilan Aksi (CTA) -->
  <g id="contact-bar" transform="translate(180, 780)">
    <rect width="2640" height="150" rx="24" fill="#090D16" opacity="0.7" stroke="#334155" stroke-width="2"/>
    <text id="cta-order" x="60" y="92" font-family="'Montserrat', sans-serif" font-size="46" font-weight="800" fill="#F59E0B">HUBUNGI KAMI SEKARANG:</text>
    <text id="contact-phone" x="800" y="92" font-family="'Montserrat', sans-serif" font-size="46" font-weight="700" fill="#FFFFFF">WhatsApp: 0812-3456-7890</text>
    <text id="contact-address" x="1750" y="92" font-family="'Montserrat', sans-serif" font-size="42" font-weight="500" fill="#94A3B8">Jl. Percetakan Raya No. 88</text>
  </g>
</svg>`;
  }

  if (category === 'businesscard') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1060 650" width="100%" height="100%">
  <defs>
    <linearGradient id="cardBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#111827"/>
      <stop offset="100%" stop-color="#1F2937"/>
    </linearGradient>
    <linearGradient id="brandAccent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${primaryColor}"/>
      <stop offset="100%" stop-color="#6366F1"/>
    </linearGradient>
  </defs>

  <!-- Latar Belakang Kartu -->
  <rect id="background" width="1060" height="650" fill="url(#cardBg)"/>

  <!-- Ornamen Sudut -->
  <path d="M780,0 L1060,0 L1060,400 Z" fill="url(#brandAccent)" opacity="0.9"/>
  <circle cx="940" cy="120" r="18" fill="#FFFFFF" opacity="0.3"/>

  <!-- Logo Perusahaan -->
  <g id="brand-logo" transform="translate(80, 80)">
    <rect width="64" height="64" rx="16" fill="url(#brandAccent)"/>
    <path d="M22,46 L32,18 L42,46 Z" fill="#FFFFFF"/>
    <text x="85" y="44" font-family="'Montserrat', sans-serif" font-size="34" font-weight="800" fill="#FFFFFF" letter-spacing="2">PRINTSTUDIO</text>
  </g>

  <!-- Nama Pemilik & Jabatan -->
  <text id="owner-name" x="80" y="270" font-family="'Montserrat', sans-serif" font-size="44" font-weight="800" fill="#FFFFFF">
    HENDRA PRATAMA, S.Ds
  </text>
  <text id="owner-title" x="80" y="315" font-family="'Montserrat', sans-serif" font-size="22" font-weight="600" fill="${primaryColor}" letter-spacing="3">
    CREATIVE DIRECTOR &amp; PRINT SPECIALIST
  </text>

  <!-- Garis Pemisah Halus -->
  <line x1="80" y1="355" x2="650" y2="355" stroke="#374151" stroke-width="2"/>

  <!-- Informasi Kontak -->
  <g id="contact-list" transform="translate(80, 395)">
    <text y="28" font-family="'Montserrat', sans-serif" font-size="20" font-weight="500" fill="#9CA3AF">Telepon / WA</text>
    <text y="58" font-family="'Montserrat', sans-serif" font-size="22" font-weight="700" fill="#E5E7EB">+62 812-9876-5432</text>

    <text x="320" y="28" font-family="'Montserrat', sans-serif" font-size="20" font-weight="500" fill="#9CA3AF">Email Resmi</text>
    <text x="320" y="58" font-family="'Montserrat', sans-serif" font-size="22" font-weight="700" fill="#E5E7EB">hendra@printstudio.id</text>

    <text y="125" font-family="'Montserrat', sans-serif" font-size="20" font-weight="500" fill="#9CA3AF">Alamat Studio</text>
    <text y="155" font-family="'Montserrat', sans-serif" font-size="22" font-weight="700" fill="#E5E7EB">Kuningan Creative Hub, Jakarta Selatan</text>

    <text x="420" y="125" font-family="'Montserrat', sans-serif" font-size="20" font-weight="500" fill="#9CA3AF">Situs Web</text>
    <text x="420" y="155" font-family="'Montserrat', sans-serif" font-size="22" font-weight="700" fill="#E5E7EB">www.printstudio.id</text>
  </g>
</svg>`;
  }

  if (category === 'xbanner' || category === 'rollup') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 1600" width="100%" height="100%">
  <defs>
    <linearGradient id="vertBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="60%" stop-color="#1E1B4B"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
    <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${primaryColor}"/>
      <stop offset="100%" stop-color="#EC4899"/>
    </linearGradient>
  </defs>

  <!-- Latar Belakang Vertikal -->
  <rect id="background" width="600" height="1600" fill="url(#vertBg)"/>

  <!-- Ornamen Grafis Melengkung -->
  <path d="M0,0 Q300,300 600,100 L600,0 Z" fill="${primaryColor}" opacity="0.25"/>
  <path d="M0,1300 Q300,1200 600,1400 L600,1600 L0,1600 Z" fill="${primaryColor}" opacity="0.3"/>

  <!-- Header Logo -->
  <g id="logo-header" transform="translate(60, 90)">
    <circle cx="36" cy="36" r="36" fill="url(#glowGrad)"/>
    <text x="90" y="46" font-family="'Montserrat', sans-serif" font-size="30" font-weight="800" fill="#FFFFFF" letter-spacing="2">PRINTSTUDIO</text>
    <text x="90" y="72" font-family="'Montserrat', sans-serif" font-size="14" font-weight="500" fill="#94A3B8">PREMIUM PRINTING SOLUTION</text>
  </g>

  <!-- Badge Penawaran -->
  <rect x="60" y="240" width="220" height="48" rx="24" fill="url(#glowGrad)"/>
  <text x="170" y="271" font-family="'Montserrat', sans-serif" font-size="18" font-weight="800" fill="#FFFFFF" text-anchor="middle">NEW ARRIVAL 2026</text>

  <!-- Judul Vertikal Menarik -->
  <text id="headline-part1" x="60" y="380" font-family="'Montserrat', sans-serif" font-size="64" font-weight="900" fill="#FFFFFF" letter-spacing="-1">
    CETAK KILAT
  </text>
  <text id="headline-part2" x="60" y="450" font-family="'Montserrat', sans-serif" font-size="64" font-weight="900" fill="${primaryColor}" letter-spacing="-1">
    KUALITAS PRO
  </text>

  <!-- Subheadline -->
  <text id="subheadline" x="60" y="520" font-family="'Montserrat', sans-serif" font-size="22" font-weight="500" fill="#CBD5E1">
    Solusi visual lengkap untuk pameran, toko, dan acara perusahaan Anda.
  </text>

  <!-- 3 Kotak Layanan Unggulan -->
  <g id="feature-card-1" transform="translate(60, 580)">
    <rect width="480" height="130" rx="16" fill="#1E293B" stroke="#334155" stroke-width="1.5"/>
    <rect x="20" y="25" width="80" height="80" rx="12" fill="${primaryColor}" opacity="0.3"/>
    <text x="120" y="55" font-family="'Montserrat', sans-serif" font-size="22" font-weight="700" fill="#FFFFFF">Roll-Up &amp; X-Banner</text>
    <text x="120" y="85" font-family="'Montserrat', sans-serif" font-size="16" font-weight="400" fill="#94A3B8">Bahan Albatros doff / glossy premium</text>
  </g>

  <g id="feature-card-2" transform="translate(60, 740)">
    <rect width="480" height="130" rx="16" fill="#1E293B" stroke="#334155" stroke-width="1.5"/>
    <rect x="20" y="25" width="80" height="80" rx="12" fill="#EC4899" opacity="0.3"/>
    <text x="120" y="55" font-family="'Montserrat', sans-serif" font-size="22" font-weight="700" fill="#FFFFFF">Brosur &amp; Selebaran</text>
    <text x="120" y="85" font-family="'Montserrat', sans-serif" font-size="16" font-weight="400" fill="#94A3B8">Art Paper 150g cetak offset presisi</text>
  </g>

  <g id="feature-card-3" transform="translate(60, 900)">
    <rect width="480" height="130" rx="16" fill="#1E293B" stroke="#334155" stroke-width="1.5"/>
    <rect x="20" y="25" width="80" height="80" rx="12" fill="#10B981" opacity="0.3"/>
    <text x="120" y="55" font-family="'Montserrat', sans-serif" font-size="22" font-weight="700" fill="#FFFFFF">Stiker Label Cutting</text>
    <text x="120" y="85" font-family="'Montserrat', sans-serif" font-size="16" font-weight="400" fill="#94A3B8">Vinyl tahan air anti pudar siap tempel</text>
  </g>

  <!-- Testimoni / Badge Terpercaya -->
  <g id="trust-badge" transform="translate(60, 1070)">
    <rect width="480" height="90" rx="16" fill="#0F172A" stroke="#312E81" stroke-width="2"/>
    <text x="240" y="42" font-family="'Montserrat', sans-serif" font-size="18" font-weight="700" fill="#F59E0B" text-anchor="middle">★★★★★ 4.9/5 DARI 2.500+ KLIEN</text>
    <text x="240" y="68" font-family="'Montserrat', sans-serif" font-size="14" font-weight="500" fill="#94A3B8" text-anchor="middle">Garansi Hasil Cetak Tajam &amp; Sesuai Warna</text>
  </g>

  <!-- Panggilan Aksi Bawah & Kontak -->
  <g id="bottom-cta" transform="translate(60, 1200)">
    <rect width="480" height="280" rx="20" fill="url(#glowGrad)"/>
    <text x="240" y="60" font-family="'Montserrat', sans-serif" font-size="28" font-weight="800" fill="#FFFFFF" text-anchor="middle">KONSULTASI GRATIS</text>
    <text x="240" y="95" font-family="'Montserrat', sans-serif" font-size="16" font-weight="500" fill="#FCE7F3" text-anchor="middle">Kirim file langsung cetak hari ini</text>

    <!-- Tombol WhatsApp -->
    <rect x="50" y="130" width="380" height="60" rx="30" fill="#FFFFFF"/>
    <text x="240" y="168" font-family="'Montserrat', sans-serif" font-size="20" font-weight="800" fill="#1E1B4B" text-anchor="middle">WA: 0812-8888-9999</text>

    <text x="240" y="235" font-family="'Montserrat', sans-serif" font-size="15" font-weight="600" fill="#FFFFFF" text-anchor="middle">IG: @printstudio.official</text>
  </g>
</svg>`;
  }

  // Template generik poster / flyer
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1130" width="100%" height="100%">
  <defs>
    <linearGradient id="mainBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B0F19"/>
      <stop offset="50%" stop-color="#1A2035"/>
      <stop offset="100%" stop-color="#0B0F19"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${primaryColor}"/>
      <stop offset="100%" stop-color="#38BDF8"/>
    </linearGradient>
  </defs>

  <rect id="background" width="800" height="1130" fill="url(#mainBg)"/>

  <!-- Ornamen Lingkaran & Garis -->
  <circle cx="700" cy="150" r="280" fill="${primaryColor}" opacity="0.2"/>
  <circle cx="100" cy="950" r="240" fill="#38BDF8" opacity="0.15"/>

  <!-- Kategori & Tagline -->
  <text id="tagline" x="70" y="100" font-family="'Montserrat', sans-serif" font-size="20" font-weight="700" fill="${primaryColor}" letter-spacing="4">
    STUDIO CETAK INDONESIA
  </text>

  <!-- Judul Utama -->
  <text id="headline" x="70" y="220" font-family="'Montserrat', sans-serif" font-size="68" font-weight="900" fill="#FFFFFF">
    DESAIN CETAK
  </text>
  <text id="headline-sub" x="70" y="295" font-family="'Montserrat', sans-serif" font-size="68" font-weight="900" fill="url(#accent)">
    PREFESIONAL
  </text>

  <!-- Deskripsi Isi -->
  <text id="body-text" x="70" y="380" font-family="'Montserrat', sans-serif" font-size="22" font-weight="400" fill="#CBD5E1">
    Koleksi template siap cetak beresolusi tinggi dengan garis potong
  </text>
  <text x="70" y="415" font-family="'Montserrat', sans-serif" font-size="22" font-weight="400" fill="#CBD5E1">
    dan area aman berstandar industri percetakan modern.
  </text>

  <!-- Kartu Penawaran -->
  <g id="offer-box" transform="translate(70, 480)">
    <rect width="660" height="340" rx="20" fill="#151C2C" stroke="#2A344A" stroke-width="2"/>
    <text x="50" y="65" font-family="'Montserrat', sans-serif" font-size="28" font-weight="800" fill="#FFFFFF">SPESIFIKASI STANDAR CETAK</text>
    
    <text x="50" y="125" font-family="'Montserrat', sans-serif" font-size="20" font-weight="600" fill="#38BDF8">• Resolusi Vektor SVG Tajam Tanpa Pecah</text>
    <text x="50" y="175" font-family="'Montserrat', sans-serif" font-size="20" font-weight="600" fill="#38BDF8">• Safe Area 5mm Menghindari Teks Terpotong</text>
    <text x="50" y="225" font-family="'Montserrat', sans-serif" font-size="20" font-weight="600" fill="#38BDF8">• Area Bleed 3mm Siap Mesin Potong Guillotine</text>
    <text x="50" y="275" font-family="'Montserrat', sans-serif" font-size="20" font-weight="600" fill="#38BDF8">• Kompatibel Adobe Illustrator &amp; CorelDRAW</text>
  </g>

  <!-- Footer Info Kontak -->
  <g id="footer-contact" transform="translate(70, 920)">
    <rect width="660" height="120" rx="16" fill="url(#accent)"/>
    <text x="330" y="55" font-family="'Montserrat', sans-serif" font-size="26" font-weight="800" fill="#FFFFFF" text-anchor="middle">ORDER &amp; KONSULTASI DESAIN</text>
    <text x="330" y="92" font-family="'Montserrat', sans-serif" font-size="20" font-weight="600" fill="#FFFFFF" text-anchor="middle">WhatsApp: 0812-3456-7890 | www.printstudio.id</text>
  </g>
</svg>`;
}
