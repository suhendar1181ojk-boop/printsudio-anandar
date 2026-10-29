/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UnitType = 'cm' | 'mm' | 'm' | 'px' | 'inch';
export type DpiType = 150 | 300;

export interface DimensionInput {
  width: number;
  height: number;
  unit: UnitType;
  dpi?: DpiType;
  bleedMm?: number;
  safeAreaMm?: number;
}

export interface DimensionResult {
  widthMm: number;
  heightMm: number;
  widthCm: number;
  heightCm: number;
  widthM: number;
  heightM: number;
  areaM2: number;
  widthPx: number;
  heightPx: number;
  bleedPx: number;
  safeAreaPx: number;
  viewBox: string;
  bleedMm: number;
  safeAreaMm: number;
}

export interface PrintCostOptions {
  costPerM2?: number; // Biaya per meter persegi (e.g. flexi banner)
  costPerSheet?: number; // Biaya per lembar (e.g. A3+ flyer)
  quantity?: number;
  finishingCost?: number; // Biaya ring/mata ayam/laminasi
}

/**
 * Konversi nilai dari satuan asal ke milimeter (mm)
 */
export function convertToMm(value: number, unit: UnitType, dpi: DpiType = 300): number {
  if (value <= 0) return 0;
  switch (unit) {
    case 'mm':
      return value;
    case 'cm':
      return value * 10;
    case 'm':
      return value * 1000;
    case 'inch':
      return value * 25.4;
    case 'px':
      // 1 inch = 25.4 mm. px / dpi * 25.4
      return (value / dpi) * 25.4;
    default:
      return value;
  }
}

/**
 * Konversi dari milimeter ke piksel pada DPI tertentu
 */
export function mmToPixels(mm: number, dpi: DpiType = 300): number {
  return Math.round((mm / 25.4) * dpi);
}

/**
 * Hitung kalkulasi dimensi cetak lengkap termasuk bleed dan safe area
 */
export function calculatePrintDimensions(input: DimensionInput): DimensionResult {
  const dpi = input.dpi || 300;
  const bleedMm = input.bleedMm !== undefined ? input.bleedMm : 3;
  const safeAreaMm = input.safeAreaMm !== undefined ? input.safeAreaMm : 5;

  const widthMm = convertToMm(input.width, input.unit, dpi);
  const heightMm = convertToMm(input.height, input.unit, dpi);

  const widthCm = widthMm / 10;
  const heightCm = heightMm / 10;
  const widthM = widthMm / 1000;
  const heightM = heightMm / 1000;
  const areaM2 = Math.round(widthM * heightM * 10000) / 10000;

  // Total canvas pixels including bleed on both sides
  const totalWidthMm = widthMm + bleedMm * 2;
  const totalHeightMm = heightMm + bleedMm * 2;

  const widthPx = mmToPixels(totalWidthMm, dpi);
  const heightPx = mmToPixels(totalHeightMm, dpi);
  const bleedPx = mmToPixels(bleedMm, dpi);
  const safeAreaPx = mmToPixels(safeAreaMm, dpi);

  return {
    widthMm,
    heightMm,
    widthCm,
    heightCm,
    widthM,
    heightM,
    areaM2,
    widthPx,
    heightPx,
    bleedPx,
    safeAreaPx,
    viewBox: `0 0 ${widthPx} ${heightPx}`,
    bleedMm,
    safeAreaMm,
  };
}

/**
 * Hitung estimasi mata ayam (grommets) untuk spanduk/banner
 * Biasanya 1 mata ayam di tiap sudut + setiap 1 meter keliling
 */
export function calculateGrommets(widthM: number, heightM: number): number {
  if (widthM <= 0 || heightM <= 0) return 4;
  const perimeter = 2 * (widthM + heightM);
  // 4 sudut wajib, lalu keliling dibagi ~1m
  const intermediate = Math.max(0, Math.floor(perimeter) - 4);
  return 4 + intermediate;
}

/**
 * Hitung estimasi total biaya cetak
 */
export function calculatePrintCost(
  areaM2: number,
  quantity: number = 1,
  options: PrintCostOptions = {}
): {
  subtotal: number;
  finishing: number;
  total: number;
  formattedTotal: string;
} {
  const qty = Math.max(1, quantity);
  let subtotal = 0;

  if (options.costPerM2 && options.costPerM2 > 0) {
    // Biaya berbasis meter persegi (min 1m² per unit biasanya di percetakan)
    const billableArea = Math.max(1, areaM2);
    subtotal = billableArea * options.costPerM2 * qty;
  } else if (options.costPerSheet && options.costPerSheet > 0) {
    subtotal = options.costPerSheet * qty;
  }

  const finishing = (options.finishingCost || 0) * qty;
  const total = Math.round(subtotal + finishing);

  const formattedTotal = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(total);

  return {
    subtotal: Math.round(subtotal),
    finishing,
    total,
    formattedTotal,
  };
}
