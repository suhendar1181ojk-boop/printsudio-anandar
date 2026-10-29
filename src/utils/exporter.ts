/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from 'jspdf';
import { DimensionResult } from './printCalc';

/**
 * Download SVG file
 */
export function downloadSvg(svgString: string, filename: string = 'desain-printstudio.svg') {
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Salin kode SVG ke papan klip
 */
export async function copySvgToClipboard(svgString: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(svgString);
    return true;
  } catch (err) {
    console.error('Gagal menyalin SVG:', err);
    return false;
  }
}

/**
 * Render SVG ke Canvas HTML
 */
export function renderSvgToCanvas(
  svgString: string,
  width: number,
  height: number
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    // Batasi maksimum resolusi render canvas agar tidak melebihi memori browser (maksimal 4096px)
    const maxDim = 4096;
    let renderW = width;
    let renderH = height;

    if (renderW > maxDim || renderH > maxDim) {
      const ratio = Math.min(maxDim / renderW, maxDim / renderH);
      renderW = Math.round(renderW * ratio);
      renderH = Math.round(renderH * ratio);
    }

    canvas.width = renderW;
    canvas.height = renderH;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Canvas 2D context not available'));
      return;
    }

    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, renderW, renderH);
      ctx.drawImage(img, 0, 0, renderW, renderH);
      URL.revokeObjectURL(url);
      resolve(canvas);
    };

    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(new Error('Gagal merender SVG ke gambar canvas'));
    };

    img.src = url;
  });
}

/**
 * Export ke PNG resolusi tinggi
 */
export async function exportToPng(
  svgString: string,
  dim: DimensionResult,
  filename: string = 'desain-printstudio.png'
) {
  const canvas = await renderSvgToCanvas(svgString, dim.widthPx, dim.heightPx);
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 'image/png');
}

/**
 * Export ke JPG
 */
export async function exportToJpg(
  svgString: string,
  dim: DimensionResult,
  filename: string = 'desain-printstudio.jpg'
) {
  const canvas = await renderSvgToCanvas(svgString, dim.widthPx, dim.heightPx);
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 'image/jpeg', 0.95);
}

/**
 * Export ke PDF Siap Cetak menggunakan jsPDF
 */
export async function exportToPdf(
  svgString: string,
  dim: DimensionResult,
  filename: string = 'desain-siap-cetak.pdf'
) {
  // Hitung orientasi dan ukuran dokumen PDF dalam mm
  const isLandscape = dim.widthMm >= dim.heightMm;
  const pdfW = isLandscape ? dim.widthMm : dim.heightMm;
  const pdfH = isLandscape ? dim.heightMm : dim.widthMm;

  // Render canvas
  const canvas = await renderSvgToCanvas(svgString, dim.widthPx, dim.heightPx);
  const imgData = canvas.toDataURL('image/jpeg', 0.98);

  const doc = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'mm',
    format: [dim.widthMm, dim.heightMm],
  });

  doc.addImage(imgData, 'JPEG', 0, 0, dim.widthMm, dim.heightMm);
  doc.save(filename);
}

/**
 * Format link WhatsApp untuk berbagi desain
 */
export function formatWhatsAppShare(
  projectName: string,
  category: string,
  width: number,
  height: number,
  unit: string,
  conceptNote: string
): string {
  const text = `*PrintStudio AI - Hasil Desain Siap Cetak* 🖨️✨

📁 *Proyek:* ${projectName}
📐 *Jenis & Ukuran:* ${category} (${width} x ${height} ${unit})
💡 *Konsep:* ${conceptNote}

Desain dibuat dengan vektor SVG beresolusi tajam dan batas pra-cetak (bleed & safe area) presisi.`;

  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
