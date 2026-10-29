import test from 'node:test';
import assert from 'node:assert/strict';
import { generateDynamicVectorDesign } from './dynamicVectorGenerator';
import { extractEditableElements, sanitizeAndCleanSvg } from './svgParser';

test('generateDynamicVectorDesign creates valid landscape banner SVG', () => {
  const result = generateDynamicVectorDesign({
    category: 'banner',
    width: 300,
    height: 100,
    unit: 'cm',
    style: 'modern',
    primaryColor: '#4F46E5',
    structuredData: {
      businessName: 'WARUNG MAKAN SEDAP',
      headline: 'MENU SPESIAL NASI LIWET',
      subheadline: 'Rasa Autentik Gurih',
      bodyContent: 'Ayam Goreng Lengkuas, Sambal Terasi, Lalapan Segar',
      callToAction: 'Pesan Antar',
      contactInfo: '0812-9999-8888',
      address: 'Jl. Merdeka No. 45',
    },
  });

  assert.ok(result.svg.startsWith('<svg'));
  assert.ok(result.svg.includes('WARUNG MAKAN SEDAP') || result.svg.includes('MENU SPESIAL'));
  assert.ok(result.svg.includes('0812-9999-8888'));
  assert.ok(result.conceptNote.includes('banner'));

  // Test that editable elements can be extracted
  const editable = extractEditableElements(result.svg);
  assert.ok(editable.length >= 3);
});

test('generateDynamicVectorDesign creates distinct variation layout', () => {
  const normal = generateDynamicVectorDesign({
    category: 'banner',
    width: 300,
    height: 100,
    unit: 'cm',
    isVariation: false,
  });

  const variant = generateDynamicVectorDesign({
    category: 'banner',
    width: 300,
    height: 100,
    unit: 'cm',
    isVariation: true,
  });

  assert.notEqual(normal.svg, variant.svg);
  assert.ok(variant.conceptNote.includes('Variasi'));
});
