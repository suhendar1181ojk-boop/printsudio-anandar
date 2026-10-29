/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { getStarterTemplate } from './src/utils/templatePresets';
import { sanitizeAndCleanSvg } from './src/utils/svgParser';
import { calculatePrintDimensions } from './src/utils/printCalc';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Body parsers with larger limit for base64 logos and photos
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Server-side Gemini initialization
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const SYSTEM_INSTRUCTION = `Kamu adalah desainer grafis profesional dan ahli pra-cetak (prepress) berbahasa Indonesia untuk PrintStudio AI.
Tugasmu membuat desain siap cetak dalam bentuk kode SVG berdasarkan jenis desain, ukuran, bleed, safe area, deskripsi, gaya, warna, logo, dan foto yang diberikan pengguna.

Aturan Desain & Pra-Cetak:
1. Gunakan atribut viewBox yang proporsional dengan ukuran cetak yang diminta (termasuk area bleed) dan atribut width="100%" height="100%".
2. Taruh SEMUA teks penting, nomor telepon, dan logo di dalam safe area (jangan mendekati tepi potong).
3. Buat hierarki visual yang sangat kuat:
   - Judul utama besar, tebal (font-weight: 800-900), dan kontras tinggi.
   - Subjudul informatif (font-weight: 500-600).
   - Isi teks tersusun rapi.
   - Panggilan aksi (CTA) dan kontak (WhatsApp, Telepon, Alamat, Website) jelas dan terbaca.
   - Untuk banner outdoor: buat teks sangat besar sehingga terbaca dari jarak puluhan meter.
   - Untuk kartu nama/stiker: buat proporsional dan elegan untuk jarak dekat.
4. Gunakan palet warna yang serasi dengan warna utama dan gaya yang dipilih. Pastikan kontras teks dan latar belakang sangat tinggi.
5. Gunakan font Google Fonts 'Montserrat', sans-serif untuk konsistensi tipografi modern.
6. Beri atribut id yang jelas pada setiap elemen (contoh: id="background", id="headline", id="subheadline", id="body-text", id="cta-button", id="contact-info", id="logo", dsb) agar bisa diedit langsung di kanvas.
7. Jika ada logo atau foto yang disediakan, sertakan elemen <image ...> dengan proporsi yang pas.
8. Jangan memakai gambar eksternal yang tidak dapat dimuat secara offline. Gunakan bentuk vektor murni SVG (rect, path, circle, linearGradient, polygon) dan pola grafis modern.
9. Jangan membuat logo atau karakter berhak cipta milik merek terkenal lain. Ciptakan orisinal dan profesional.
10. TANPA watermark apapun.
11. Untuk revisi lewat chat, ubah hanya bagian yang diminta pengguna dan pertahankan struktur elemen lainnya.
12. Untuk Variasi desain, buat tata letak dan komposisi baru yang unik dengan konten dan ukuran yang sama.

Format Output WAJIB JSON:
{
  "svg": "<svg xmlns=\\"http://www.w3.org/2000/svg\\" ...>...</svg>",
  "conceptNote": "Ringkasan konsep desain 1-2 kalimat dalam bahasa Indonesia.",
  "fontAndPaletteAdvice": "Saran palet warna dan font dalam satu baris."
}`;

// Endpoint: Generate Desain Baru / Variasi
app.post('/api/generate-design', async (req: Request, res: Response) => {
  try {
    const {
      category = 'banner',
      width = 300,
      height = 100,
      unit = 'cm',
      dpi = 150,
      bleedMm = 3,
      safeAreaMm = 5,
      description = '',
      style = 'modern',
      primaryColor = '#4F46E5',
      businessProfile,
      structuredData,
      uploadedLogo,
      uploadedPhoto,
      isVariation = false,
      previousSvg = '',
    } = req.body;

    const dimensions = calculatePrintDimensions({
      width: Number(width),
      height: Number(height),
      unit,
      dpi: Number(dpi) as 150 | 300,
      bleedMm: Number(bleedMm),
      safeAreaMm: Number(safeAreaMm),
    });

    const ai = getGeminiClient();

    // Jika API Key tidak ada, gunakan template starter SVG dinamis beresolusi tinggi
    if (!ai) {
      console.warn('GEMINI_API_KEY belum disetel di environment. Menggunakan template pra-cetak SVG bawaan.');
      const fallbackSvg = getStarterTemplate(category, Number(width), Number(height), primaryColor);
      return res.json({
        svg: fallbackSvg,
        conceptNote: `Desain ${category} bergaya ${style} dengan palet warna utama ${primaryColor} dan tata letak pra-cetak presisi.`,
        fontAndPaletteAdvice: `Font: Montserrat | Palet: ${primaryColor}, #0F172A, #F59E0B, #22C55E`,
        isOfflineFallback: true,
      });
    }

    // Bangun prompt instruksi rinci
    let promptText = `Buat ${isVariation ? 'VARIASI alternatif' : 'desain baru siap cetak'} untuk:
Jenis Desain: ${category}
Ukuran Fisik: ${width} x ${height} ${unit} (Resolusi: ${dpi} DPI, Luas Cetak: ${dimensions.areaM2} m²)
Ukuran Canvas Pixels: lebar ${dimensions.widthPx}px, tinggi ${dimensions.heightPx}px (viewBox: "${dimensions.viewBox}")
Bleed: ${bleedMm} mm (${dimensions.bleedPx} px) di tiap sisi
Safe Area: ${safeAreaMm} mm (${dimensions.safeAreaPx} px) dari garis potong
Gaya Desain: ${style}
Warna Utama: ${primaryColor}
Deskripsi Kebutuhan: ${description || 'Desain promosi komersial profesional dengan daya tarik visual tinggi'}
`;

    if (structuredData) {
      promptText += `\nInformasi Terstruktur:
Nama Usaha: ${structuredData.businessName || ''}
Judul Utama: ${structuredData.headline || ''}
Subjudul: ${structuredData.subheadline || ''}
Isi Teks / Keunggulan: ${structuredData.bodyContent || ''}
Panggilan Aksi (CTA): ${structuredData.callToAction || ''}
Kontak / Telepon / WA: ${structuredData.contactInfo || ''}
Alamat: ${structuredData.address || ''}
`;
    }

    if (businessProfile) {
      promptText += `\nProfil Usaha Pemesan:
Nama Brand: ${businessProfile.businessName || ''}
Tagline: ${businessProfile.tagline || ''}
WhatsApp: ${businessProfile.phone || ''}
Email: ${businessProfile.email || ''}
Alamat: ${businessProfile.address || ''}
Instagram: ${businessProfile.instagram || ''}
`;
    }

    if (isVariation && previousSvg) {
      promptText += `\nIni adalah permintaan VARIASI. Buat komposisi tata letak dan penempatan elemen yang berbeda dan segar dari versi sebelumnya, dengan mempertahankan data teks dan dimensi yang sama.`;
    }

    // Call Gemini 3.8 Flash
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            svg: { type: Type.STRING, description: 'Kode SVG lengkap dan valid' },
            conceptNote: { type: Type.STRING, description: 'Ringkasan konsep desain 1-2 kalimat' },
            fontAndPaletteAdvice: { type: Type.STRING, description: 'Saran font dan warna satu baris' },
          },
          required: ['svg', 'conceptNote', 'fontAndPaletteAdvice'],
        },
      },
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error('AI tidak menghasilkan respon teks.');
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(textOutput);
    } catch {
      // Jika parsing JSON gagal, coba ekstrak SVG
      const cleaned = sanitizeAndCleanSvg(textOutput);
      parsedResult = {
        svg: cleaned,
        conceptNote: `Desain ${category} profesional siap cetak.`,
        fontAndPaletteAdvice: `Font: Montserrat | Warna Utama: ${primaryColor}`,
      };
    }

    const sanitizedSvg = sanitizeAndCleanSvg(parsedResult.svg);
    if (!sanitizedSvg) {
      throw new Error('Kode SVG yang dihasilkan AI tidak valid.');
    }

    res.json({
      svg: sanitizedSvg,
      conceptNote: parsedResult.conceptNote || `Desain ${category} dengan ukuran ${width}x${height} ${unit}.`,
      fontAndPaletteAdvice: parsedResult.fontAndPaletteAdvice || `Font: Montserrat | Warna: ${primaryColor}`,
    });
  } catch (error: any) {
    console.error('Error generate-design:', error);
    res.status(500).json({
      error: error.message || 'Gagal menghasilkan desain. Silakan coba lagi.',
    });
  }
});

// Endpoint: Revisi Desain via Chat
app.post('/api/revise-design', async (req: Request, res: Response) => {
  try {
    const {
      currentSvg,
      revisionPrompt,
      category = 'banner',
      width = 300,
      height = 100,
      unit = 'cm',
    } = req.body;

    if (!currentSvg || !revisionPrompt) {
      return res.status(400).json({ error: 'Kode SVG saat ini dan instruksi revisi wajib diisi.' });
    }

    const ai = getGeminiClient();

    if (!ai) {
      return res.status(503).json({
        error: 'Layanan AI membutuhkan kunci API yang valid di pengaturan aplikasi.',
      });
    }

    const promptText = `Lakukan REVISI pada kode SVG cetak berikut sesuai instruksi pengguna:

INSTRUKSI REVISI DARI PENGGUNA:
"${revisionPrompt}"

KODE SVG SAAT INI:
\`\`\`xml
${currentSvg}
\`\`\`

ATURAN REVISI:
1. Ubah HANYA bagian yang diminta oleh pengguna (misal ganti warna, ubah teks, perbesar ukuran teks judul, geser posisi, dsb).
2. Pertahankan elemen dan tata letak lainnya yang tidak diminta diubah.
3. Pastikan kode SVG tetap valid, proporsional, dan semua id elemen tetap konsisten.
4. Jangan tambahkan watermark.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            svg: { type: Type.STRING, description: 'Kode SVG yang sudah direvisi secara lengkap' },
            conceptNote: { type: Type.STRING, description: 'Penjelasan singkat perubahan yang telah dilakukan' },
            fontAndPaletteAdvice: { type: Type.STRING, description: 'Status font dan warna' },
          },
          required: ['svg', 'conceptNote', 'fontAndPaletteAdvice'],
        },
      },
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error('AI tidak menghasilkan balasan revisi.');
    }

    const parsed = JSON.parse(textOutput);
    const sanitizedSvg = sanitizeAndCleanSvg(parsed.svg);

    if (!sanitizedSvg) {
      throw new Error('Hasil revisi SVG tidak valid.');
    }

    res.json({
      svg: sanitizedSvg,
      conceptNote: parsed.conceptNote || 'Revisi desain telah berhasil diterapkan.',
      fontAndPaletteAdvice: parsed.fontAndPaletteAdvice || 'Tipografi & palet warna diperbarui.',
    });
  } catch (error: any) {
    console.error('Error revise-design:', error);
    res.status(500).json({
      error: error.message || 'Gagal merevisi desain. Silakan coba lagi.',
    });
  }
});

// Vite & Static File Serving
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PrintStudio AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
