import test from 'node:test';
import assert from 'node:assert/strict';
import {
  convertToMm,
  mmToPixels,
  calculatePrintDimensions,
  calculateGrommets,
  calculatePrintCost,
} from './printCalc';

test('convertToMm handles units correctly', () => {
  assert.equal(convertToMm(10, 'cm'), 100);
  assert.equal(convertToMm(2, 'm'), 2000);
  assert.equal(convertToMm(50, 'mm'), 50);
  assert.equal(Math.round(convertToMm(1, 'inch')), 25);
  // 300 px at 300 DPI = 1 inch = 25.4 mm
  assert.equal(Math.round(convertToMm(300, 'px', 300)), 25);
});

test('calculatePrintDimensions calculates standard business card 9 x 5.5 cm', () => {
  const result = calculatePrintDimensions({
    width: 9,
    height: 5.5,
    unit: 'cm',
    dpi: 300,
    bleedMm: 3,
    safeAreaMm: 5,
  });

  assert.equal(result.widthMm, 90);
  assert.equal(result.heightMm, 55);
  assert.equal(result.widthCm, 9);
  assert.equal(result.heightCm, 5.5);
  // Total with 3mm bleed = 96mm x 61mm
  // 96 / 25.4 * 300 = 1133.8 -> 1134
  assert.equal(result.widthPx, 1134);
  assert.equal(result.heightPx, 720);
});

test('calculatePrintDimensions calculates Banner 3 x 1 m area', () => {
  const result = calculatePrintDimensions({
    width: 3,
    height: 1,
    unit: 'm',
  });

  assert.equal(result.widthM, 3);
  assert.equal(result.heightM, 1);
  assert.equal(result.areaM2, 3);
});

test('calculateGrommets gives expected count for banner', () => {
  // 3m x 1m banner has perimeter 8m -> 4 corners + 4 intermediates = 8 grommets
  const grommets = calculateGrommets(3, 1);
  assert.equal(grommets, 8);
});

test('calculatePrintCost computes IDR total accurately', () => {
  const cost = calculatePrintCost(3, 2, {
    costPerM2: 25000,
    finishingCost: 5000,
  });

  // 3 m2 * 25,000 * 2 = 150,000 + 10,000 finishing = 160,000
  assert.equal(cost.subtotal, 150000);
  assert.equal(cost.finishing, 10000);
  assert.equal(cost.total, 160000);
  assert.ok(cost.formattedTotal.includes('160.000'));
});
