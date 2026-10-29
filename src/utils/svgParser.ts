/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface EditableElement {
  id: string;
  type: 'text' | 'rect' | 'circle' | 'path' | 'image' | 'g';
  text?: string;
  fill?: string;
  fontSize?: number;
  fontFamily?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

/**
 * Memeriksa dan membersihkan kode SVG dari AI
 */
export function sanitizeAndCleanSvg(raw: string): string {
  if (!raw) return '';

  let cleaned = raw.trim();

  // Bersihkan markdown code blocks jika ada (```xml atau ```svg atau ```)
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```[a-zA-Z]*\n?/, '');
    cleaned = cleaned.replace(/\n?```$/, '');
    cleaned = cleaned.trim();
  }

  // Temukan tag <svg hingga </svg>
  const svgStart = cleaned.indexOf('<svg');
  const svgEnd = cleaned.lastIndexOf('</svg>');

  if (svgStart !== -1 && svgEnd !== -1) {
    cleaned = cleaned.substring(svgStart, svgEnd + 6);
  } else if (svgStart !== -1 && svgEnd === -1) {
    // Kurang tag penutup
    cleaned = cleaned + '\n</svg>';
  } else {
    // Tidak ditemukan tag svg sama sekali
    return '';
  }

  // Hapus tag script berbahaya
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  // Hapus atribut event handler berbahaya seperti onload=, onclick=
  cleaned = cleaned.replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, '');

  // Pastikan ada xmlns
  if (!cleaned.includes('xmlns="http://www.w3.org/2000/svg"')) {
    cleaned = cleaned.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  return cleaned;
}

/**
 * Ekstraksi elemen teks yang dapat diedit dari SVG
 */
export function extractEditableElements(svgString: string): EditableElement[] {
  const elements: EditableElement[] = [];
  if (!svgString) return elements;

  // Regex sederhana untuk mencari tag <text>
  const textTagRegex = /<text\b([^>]*)>(.*?)<\/text>/gis;
  let match: RegExpExecArray | null;
  let counter = 1;

  while ((match = textTagRegex.exec(svgString)) !== null) {
    const attrs = match[1];
    const innerText = match[2].replace(/<[^>]+>/g, '').trim();

    // Dapatkan id jika ada
    const idMatch = attrs.match(/\bid\s*=\s*["']([^"']+)["']/i);
    const id = idMatch ? idMatch[1] : `text-element-${counter++}`;

    // Fill
    const fillMatch = attrs.match(/\bfill\s*=\s*["']([^"']+)["']/i);
    const fill = fillMatch ? fillMatch[1] : undefined;

    // Font size
    const fontSizeMatch = attrs.match(/\bfont-size\s*=\s*["']?(\d+(?:\.\d+)?)/i);
    const fontSize = fontSizeMatch ? parseFloat(fontSizeMatch[1]) : undefined;

    // Font family
    const fontFamMatch = attrs.match(/\bfont-family\s*=\s*["']([^"']+)["']/i);
    const fontFamily = fontFamMatch ? fontFamMatch[1] : undefined;

    // X & Y
    const xMatch = attrs.match(/\bx\s*=\s*["']?(-?\d+(?:\.\d+)?)/i);
    const yMatch = attrs.match(/\by\s*=\s*["']?(-?\d+(?:\.\d+)?)/i);
    const x = xMatch ? parseFloat(xMatch[1]) : undefined;
    const y = yMatch ? parseFloat(yMatch[1]) : undefined;

    if (innerText) {
      elements.push({
        id,
        type: 'text',
        text: innerText,
        fill,
        fontSize,
        fontFamily,
        x,
        y,
      });
    }
  }

  return elements;
}

/**
 * Update nilai elemen teks tertentu dalam kode SVG
 */
export function updateSvgTextElement(
  svgString: string,
  elementId: string,
  newText: string,
  newFill?: string,
  newFontSize?: number
): string {
  if (!svgString || !elementId) return svgString;

  // Cari text element dengan id tersebut
  const idPattern = new RegExp(`(<text\\b[^>]*\\bid=["']${elementId}["'][^>]*>)(.*?)(<\\/text>)`, 'is');
  const found = svgString.match(idPattern);

  if (!found) {
    // Jika tidak ditemukan by id, coba match by exact text content
    return svgString;
  }

  let openingTag = found[1];
  const closingTag = found[3];

  if (newFill) {
    if (openingTag.includes('fill=')) {
      openingTag = openingTag.replace(/\bfill=["'][^"']*["']/i, `fill="${newFill}"`);
    } else {
      openingTag = openingTag.replace('<text', `<text fill="${newFill}"`);
    }
  }

  if (newFontSize) {
    if (openingTag.includes('font-size=')) {
      openingTag = openingTag.replace(/\bfont-size=["'][^"']*["']/i, `font-size="${newFontSize}"`);
    } else {
      openingTag = openingTag.replace('<text', `<text font-size="${newFontSize}"`);
    }
  }

  return svgString.replace(idPattern, `${openingTag}${newText}${closingTag}`);
}

/**
 * Ekstraksi viewBox dari kode SVG
 */
export function extractViewBox(svgString: string): { minX: number; minY: number; width: number; height: number } {
  const vbMatch = svgString.match(/viewBox=["']\s*([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s*["']/i);
  if (vbMatch) {
    return {
      minX: parseFloat(vbMatch[1]) || 0,
      minY: parseFloat(vbMatch[2]) || 0,
      width: parseFloat(vbMatch[3]) || 1000,
      height: parseFloat(vbMatch[4]) || 1000,
    };
  }
  return { minX: 0, minY: 0, width: 1000, height: 1000 };
}

/**
 * Buat layer garis panduan (bleed, safe area, trim) SVG overlay proporsional
 */
export function generateGuideLinesSvg(
  svgString: string,
  bleedMm: number,
  safeAreaMm: number,
  widthMm: number,
  heightMm: number,
  showGuides: boolean
): string {
  if (!showGuides || !svgString) return '';

  const vb = extractViewBox(svgString);
  const wMm = Math.max(10, widthMm);
  const hMm = Math.max(10, heightMm);

  const scaleX = vb.width / wMm;
  const scaleY = vb.height / hMm;

  // Margin dalam unit viewBox
  const bleedVbX = bleedMm * scaleX;
  const bleedVbY = bleedMm * scaleY;
  const safeVbX = (bleedMm + safeAreaMm) * scaleX;
  const safeVbY = (bleedMm + safeAreaMm) * scaleY;

  const trimX = bleedVbX;
  const trimY = bleedVbY;
  const trimW = Math.max(10, vb.width - bleedVbX * 2);
  const trimH = Math.max(10, vb.height - bleedVbY * 2);

  const safeX = safeVbX;
  const safeY = safeVbY;
  const safeW = Math.max(10, vb.width - safeVbX * 2);
  const safeH = Math.max(10, vb.height - safeVbY * 2);

  const fontSize = Math.max(11, Math.round(vb.height * 0.026));
  const strokeW = Math.max(1.5, Math.round(vb.height * 0.003));

  return `
    <g id="print-guides-overlay" pointer-events="none" style="user-select: none;">
      <!-- Bleed Margin (Garis Luar Lebih Potong) -->
      <rect x="2" y="2" width="${vb.width - 4}" height="${vb.height - 4}" 
        fill="none" stroke="#EF4444" stroke-width="${strokeW}" stroke-dasharray="12,6" opacity="0.85" />
      <text x="${12}" y="${fontSize + 6}" fill="#EF4444" font-size="${fontSize}" font-family="'Montserrat', sans-serif" font-weight="700">Area Bleed (+${bleedMm}mm)</text>
      
      <!-- Trim Line (Garis Potong Akhir) -->
      <rect x="${trimX}" y="${trimY}" width="${trimW}" height="${trimH}" 
        fill="none" stroke="#94A3B8" stroke-width="${strokeW}" opacity="0.8" />
      <text x="${trimX + 12}" y="${trimY + fontSize + 6}" fill="#94A3B8" font-size="${fontSize}" font-family="'Montserrat', sans-serif" font-weight="700">Garis Potong (Trim)</text>
      
      <!-- Safe Area (Batas Aman Teks) -->
      <rect x="${safeX}" y="${safeY}" width="${safeW}" height="${safeH}" 
        fill="none" stroke="#22C55E" stroke-width="${strokeW}" stroke-dasharray="8,6" opacity="0.85" />
      <text x="${safeX + 12}" y="${safeY + fontSize + 6}" fill="#22C55E" font-size="${fontSize}" font-family="'Montserrat', sans-serif" font-weight="700">Area Aman (Safe Margin)</text>
    </g>
  `;
}
