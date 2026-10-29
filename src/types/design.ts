/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UnitType, DpiType } from '../utils/printCalc';

export type DesignCategory =
  | 'banner'
  | 'xbanner'
  | 'rollup'
  | 'flyer'
  | 'businesscard'
  | 'sticker'
  | 'poster'
  | 'invitation'
  | 'tshirt'
  | 'packaging';

export interface SizePreset {
  id: string;
  name: string;
  category: DesignCategory;
  width: number;
  height: number;
  unit: UnitType;
  description: string;
  defaultDpi: DpiType;
}

export type DesignStyle =
  | 'minimalis'
  | 'elegan'
  | 'ceria'
  | 'retro'
  | 'modern'
  | 'korporat'
  | 'islami'
  | 'industrial';

export interface BusinessProfile {
  businessName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  instagram: string;
  website: string;
  primaryColor: string;
  logoBase64?: string;
}

export interface DesignProject {
  id: string;
  name: string;
  customerName: string;
  category: DesignCategory;
  width: number;
  height: number;
  unit: UnitType;
  dpi: DpiType;
  bleedMm: number;
  safeAreaMm: number;
  style: DesignStyle;
  primaryColor: string;
  currentSvg: string;
  conceptNote: string;
  fontAndPaletteAdvice: string;
  versions: DesignVersion[];
  isFavorite: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface DesignVersion {
  id: string;
  timestamp: number;
  svg: string;
  summary: string;
  source: 'ai_generate' | 'ai_variation' | 'ai_chat' | 'canvas_edit' | 'template' | 'duplicate';
}

export interface StructuredFormData {
  businessName: string;
  headline: string;
  subheadline: string;
  bodyContent: string;
  callToAction: string;
  contactInfo: string;
  address: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
  svgUpdated?: boolean;
}

export type InputMode = 'structured' | 'free' | 'template' | 'chat';
