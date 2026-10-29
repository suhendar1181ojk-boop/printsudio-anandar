import test from 'node:test';
import assert from 'node:assert/strict';
import {
  sanitizeAndCleanSvg,
  extractEditableElements,
  updateSvgTextElement,
  generateGuideLinesSvg,
} from './svgParser';

test('sanitizeAndCleanSvg removes markdown codeblocks and dangerous scripts', () => {
  const markdownSvg = '```xml\n<svg viewBox="0 0 100 100"><script>alert(1)</script><text>Halo</text></svg>\n```';
  const cleaned = sanitizeAndCleanSvg(markdownSvg);
  assert.ok(cleaned.startsWith('<svg'));
  assert.ok(cleaned.endsWith('</svg>'));
  assert.ok(!cleaned.includes('<script>'));
  assert.ok(cleaned.includes('Halo'));
  assert.ok(cleaned.includes('xmlns="http://www.w3.org/2000/svg"'));
});

test('extractEditableElements finds text nodes and attributes', () => {
  const svg = `<svg viewBox="0 0 800 600">
    <text id="judul-utama" x="100" y="80" fill="#4F46E5" font-size="32" font-family="Montserrat">DISKON AKBAR 50%</text>
    <text id="subjudul" x="100" y="120" fill="#333333" font-size="16">Semua Produk Percetakan</text>
  </svg>`;

  const elements = extractEditableElements(svg);
  assert.equal(elements.length, 2);
  assert.equal(elements[0].id, 'judul-utama');
  assert.equal(elements[0].text, 'DISKON AKBAR 50%');
  assert.equal(elements[0].fill, '#4F46E5');
  assert.equal(elements[0].fontSize, 32);

  assert.equal(elements[1].id, 'subjudul');
  assert.equal(elements[1].text, 'Semua Produk Percetakan');
});

test('updateSvgTextElement updates text and color', () => {
  const svg = `<svg viewBox="0 0 800 600">
    <text id="judul-utama" x="100" y="80" fill="#4F46E5" font-size="32">DISKON AKBAR 50%</text>
  </svg>`;

  const updated = updateSvgTextElement(svg, 'judul-utama', 'PROMO SPESIAL LEBARAN', '#22C55E', 36);
  assert.ok(updated.includes('PROMO SPESIAL LEBARAN'));
  assert.ok(updated.includes('fill="#22C55E"'));
  assert.ok(updated.includes('font-size="36"'));
  assert.ok(!updated.includes('DISKON AKBAR 50%'));
});

test('generateGuideLinesSvg creates bleed, trim, and safe area overlay', () => {
  const guides = generateGuideLinesSvg('<svg viewBox="0 0 1000 600"></svg>', 3, 5, 100, 60, true);
  assert.ok(guides.includes('id="print-guides-overlay"'));
  assert.ok(guides.includes('Area Bleed'));
  assert.ok(guides.includes('Garis Potong (Trim)'));
  assert.ok(guides.includes('Area Aman (Safe Margin)'));
});
