/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { SidebarLeft } from './components/SidebarLeft';
import { CanvasCenter } from './components/CanvasCenter';
import { SidebarRight } from './components/SidebarRight';
import { MockupModal } from './components/MockupModal';
import { CompareModal } from './components/CompareModal';
import { ResizeDuplicateModal } from './components/ResizeDuplicateModal';
import { CalculatorModal } from './components/CalculatorModal';
import { BusinessProfileModal } from './components/BusinessProfileModal';
import { ProjectsModal } from './components/ProjectsModal';
import { TemplatesModal } from './components/TemplatesModal';
import {
  DesignCategory,
  SizePreset,
  DesignStyle,
  InputMode,
  StructuredFormData,
  BusinessProfile,
  DesignProject,
  DesignVersion,
  ChatMessage,
} from './types/design';
import { getStarterTemplate, SIZE_PRESETS } from './utils/templatePresets';
import { calculatePrintDimensions, UnitType, DpiType } from './utils/printCalc';
import {
  extractEditableElements,
  updateSvgTextElement,
  sanitizeAndCleanSvg,
} from './utils/svgParser';
import {
  downloadSvg,
  exportToPng,
  exportToJpg,
  exportToPdf,
  formatWhatsAppShare,
} from './utils/exporter';
import { Sliders, Eye, MessageSquare } from 'lucide-react';

const STORAGE_KEY_PROJECTS = 'printstudio_projects_v1';
const STORAGE_KEY_PROFILE = 'printstudio_profile_v1';

export default function App() {
  // Theme & Layout
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [mobileTab, setMobileTab] = useState<'input' | 'canvas' | 'revision'>('canvas');

  // Project Info
  const [projectId, setProjectId] = useState<string>('project-1');
  const [projectName, setProjectName] = useState<string>('Pesanan Spanduk #101');
  const [customerName, setCustomerName] = useState<string>('Toko Berkah');
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  // Print Specifications
  const [category, setCategory] = useState<DesignCategory>('banner');
  const [width, setWidth] = useState<number>(300);
  const [height, setHeight] = useState<number>(100);
  const [unit, setUnit] = useState<UnitType>('cm');
  const [dpi, setDpi] = useState<DpiType>(150);
  const [bleedMm, setBleedMm] = useState<number>(3);
  const [safeAreaMm, setSafeAreaMm] = useState<number>(5);

  // Design Controls
  const [inputMode, setInputMode] = useState<InputMode>('structured');
  const [description, setDescription] = useState<string>(
    'Spanduk promosi percetakan digital, hasil tajam 1 hari jadi, bahan flexi korea tahan cuaca, hubungi WA 0812-3456-7890'
  );
  const [structuredData, setStructuredData] = useState<StructuredFormData>({
    businessName: 'PERCETAKAN DIGITAL CEPAT',
    headline: 'CETAK KILAT 1 HARI JADI',
    subheadline: 'Spanduk • Banner • Kartu Nama • Brosur • Stiker',
    bodyContent: 'Bahan Flexi Korea Tebal • Warna Tajam Anti Pudar • Gratis Finishing Mata Ayam',
    callToAction: 'Pesan Sekarang Juga!',
    contactInfo: '0812-3456-7890',
    address: 'Jl. Percetakan Raya No. 88',
  });
  const [selectedStyle, setSelectedStyle] = useState<DesignStyle>('modern');
  const [primaryColor, setPrimaryColor] = useState<string>('#4F46E5');

  // Uploaded Assets
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);

  // Business Profile
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>({
    businessName: 'Percetakan Cepat Berkah',
    tagline: 'Solusi Cetak Vektor Cepat & Presisi',
    phone: '0812-3456-7890',
    email: 'order@percetakanberkah.com',
    address: 'Jl. Percetakan Raya No. 88, Jakarta Pusat',
    instagram: '@percetakan.berkah',
    website: 'www.percetakanberkah.com',
    primaryColor: '#4F46E5',
  });

  // SVG State & History
  const [svgString, setSvgString] = useState<string>(() =>
    getStarterTemplate('banner', 300, 100, '#4F46E5')
  );
  const [conceptNote, setConceptNote] = useState<string>(
    'Spanduk outdoor 3x1 meter dengan kontras visual tinggi, batas potong bleed 3mm, dan safe area 5mm.'
  );
  const [fontAndPaletteAdvice, setFontAndPaletteAdvice] = useState<string>(
    'Font: Montserrat | Palet: Indigo #4F46E5, Gelap #0F172A, Amber #F59E0B'
  );

  // Version History Stack for Undo/Redo
  const [versions, setVersions] = useState<DesignVersion[]>([
    {
      id: 'v-initial',
      timestamp: Date.now(),
      svg: getStarterTemplate('banner', 300, 100, '#4F46E5'),
      summary: 'Desain awal starter template banner 3x1m',
      source: 'template',
    },
  ]);
  const [currentVersionIndex, setCurrentVersionIndex] = useState<number>(0);

  // Chat & Right Panel
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [rightPanelTab, setRightPanelTab] = useState<'chat' | 'properties' | 'history'>('chat');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // Loading & Error States
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStatusText, setGenerationStatusText] = useState<string>('');
  const [isRevising, setIsRevising] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals
  const [showMockup, setShowMockup] = useState<boolean>(false);
  const [showCompare, setShowCompare] = useState<boolean>(false);
  const [showResize, setShowResize] = useState<boolean>(false);
  const [showCalculator, setShowCalculator] = useState<boolean>(false);
  const [showBusinessProfile, setShowBusinessProfile] = useState<boolean>(false);
  const [showProjects, setShowProjects] = useState<boolean>(false);
  const [showTemplates, setShowTemplates] = useState<boolean>(false);

  // Saved Projects
  const [projectsList, setProjectsList] = useState<DesignProject[]>([]);

  // Calculate current print dimensions
  const dimensions = calculatePrintDimensions({
    width,
    height,
    unit,
    dpi,
    bleedMm,
    safeAreaMm,
  });

  // Extract editable text elements from current SVG
  const editableElements = React.useMemo(() => {
    return extractEditableElements(svgString);
  }, [svgString]);

  // Load saved projects & profile from localStorage on mount
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (savedProfile) {
        setBusinessProfile(JSON.parse(savedProfile));
      }
      const savedProjects = localStorage.getItem(STORAGE_KEY_PROJECTS);
      if (savedProjects) {
        setProjectsList(JSON.parse(savedProjects));
      }
    } catch (e) {
      console.error('Gagal membaca localStorage:', e);
    }
  }, []);

  // Save current project state periodically
  const saveCurrentProjectToStorage = useCallback(() => {
    const project: DesignProject = {
      id: projectId,
      name: projectName,
      customerName,
      category,
      width,
      height,
      unit,
      dpi,
      bleedMm,
      safeAreaMm,
      style: selectedStyle,
      primaryColor,
      currentSvg: svgString,
      conceptNote,
      fontAndPaletteAdvice,
      versions,
      isFavorite,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setProjectsList((prev) => {
      const exists = prev.findIndex((p) => p.id === projectId);
      let updated;
      if (exists >= 0) {
        updated = [...prev];
        updated[exists] = project;
      } else {
        updated = [project, ...prev];
      }
      try {
        localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(updated));
      } catch (err) {
        console.error('Gagal menyimpan proyek:', err);
      }
      return updated;
    });
  }, [
    projectId,
    projectName,
    customerName,
    category,
    width,
    height,
    unit,
    dpi,
    bleedMm,
    safeAreaMm,
    selectedStyle,
    primaryColor,
    svgString,
    conceptNote,
    fontAndPaletteAdvice,
    versions,
    isFavorite,
  ]);

  // Push new version to history stack
  const pushNewVersion = (newSvg: string, summary: string, source: DesignVersion['source']) => {
    const newVer: DesignVersion = {
      id: `v-${Date.now()}`,
      timestamp: Date.now(),
      svg: newSvg,
      summary,
      source,
    };
    // Potong redo history jika ada perubahan baru
    const updatedVersions = [newVer, ...versions.slice(currentVersionIndex)];
    setVersions(updatedVersions);
    setCurrentVersionIndex(0);
    setSvgString(newSvg);
  };

  // Undo / Redo
  const canUndo = currentVersionIndex < versions.length - 1;
  const canRedo = currentVersionIndex > 0;

  const handleUndo = () => {
    if (!canUndo) return;
    const nextIdx = currentVersionIndex + 1;
    setCurrentVersionIndex(nextIdx);
    setSvgString(versions[nextIdx].svg);
  };

  const handleRedo = () => {
    if (!canRedo) return;
    const prevIdx = currentVersionIndex - 1;
    setCurrentVersionIndex(prevIdx);
    setSvgString(versions[prevIdx].svg);
  };

  // Keyboard shortcut listener for Ctrl+Z / Ctrl+Y
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentVersionIndex, versions]);

  // Generate Desain AI
  const handleGenerate = async (isVariation: boolean = false) => {
    setIsGenerating(true);
    setErrorMessage(null);
    setGenerationStatusText('Menghitung dimensi pra-cetak...');

    try {
      const statusTimer1 = setTimeout(() => {
        setGenerationStatusText('Menyusun tata letak & hierarki teks...');
      }, 1200);

      const statusTimer2 = setTimeout(() => {
        setGenerationStatusText('Memeriksa batas bleed 3mm & safe margin...');
      }, 2500);

      const response = await fetch('/api/generate-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          width,
          height,
          unit,
          dpi,
          bleedMm,
          safeAreaMm,
          description,
          style: selectedStyle,
          primaryColor,
          businessProfile,
          structuredData: inputMode === 'structured' ? structuredData : undefined,
          uploadedLogo,
          uploadedPhoto,
          isVariation,
          previousSvg: isVariation ? svgString : undefined,
        }),
      });

      clearTimeout(statusTimer1);
      clearTimeout(statusTimer2);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Terjadi gangguan saat memproses desain.');
      }

      const data = await response.json();
      if (!data.svg) {
        throw new Error('Hasil kode SVG tidak valid.');
      }

      setConceptNote(data.conceptNote || '');
      setFontAndPaletteAdvice(data.fontAndPaletteAdvice || '');
      pushNewVersion(
        data.svg,
        isVariation ? 'Variasi tata letak desain' : `Generate desain baru ${category}`,
        isVariation ? 'ai_variation' : 'ai_generate'
      );

      // On mobile, switch to canvas view automatically after generation
      setMobileTab('canvas');
    } catch (err: any) {
      console.error('Error generating design:', err);
      setErrorMessage(
        err.message || 'Gagal membuat desain. Silakan periksa koneksi atau coba lagi.'
      );
    } finally {
      setIsGenerating(false);
      setGenerationStatusText('');
    }
  };

  // Chat Revisi Desain
  const handleSendChatMessage = async (prompt: string) => {
    setIsRevising(true);
    setErrorMessage(null);

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: Date.now(),
    };
    setChatMessages((prev) => [...prev, userMsg]);

    try {
      const response = await fetch('/api/revise-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentSvg: svgString,
          revisionPrompt: prompt,
          category,
          width,
          height,
          unit,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Gagal menerapkan revisi.');
      }

      const data = await response.json();
      if (!data.svg) throw new Error('Hasil revisi SVG tidak valid.');

      pushNewVersion(data.svg, `Revisi: "${prompt}"`, 'ai_chat');

      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: data.conceptNote || 'Revisi berhasil diterapkan pada kanvas.',
        timestamp: Date.now(),
        svgUpdated: true,
      };
      setChatMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Error revising design:', err);
      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: `Maaf, gagal menerapkan revisi: ${err.message}. Silakan coba instruksi lain.`,
        timestamp: Date.now(),
      };
      setChatMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsRevising(false);
    }
  };

  // Direct On-Canvas Element Update
  const handleUpdateElementText = (
    elementId: string,
    newText: string,
    newFill?: string,
    newFontSize?: number
  ) => {
    const updated = updateSvgTextElement(svgString, elementId, newText, newFill, newFontSize);
    pushNewVersion(updated, `Edit teks #${elementId} pada kanvas`, 'canvas_edit');
  };

  // Switch category & reset dimensions
  const handleSelectCategory = (cat: DesignCategory) => {
    setCategory(cat);
    const preset = SIZE_PRESETS.find((p) => p.category === cat) || SIZE_PRESETS[0];
    setWidth(preset.width);
    setHeight(preset.height);
    setUnit(preset.unit);
    setDpi(preset.defaultDpi);
  };

  // Apply starter template
  const handleSelectTemplate = (cat: DesignCategory, preset: SizePreset, tmplSvg: string) => {
    setCategory(cat);
    setWidth(preset.width);
    setHeight(preset.height);
    setUnit(preset.unit);
    setDpi(preset.defaultDpi);
    pushNewVersion(tmplSvg, `Menggunakan template ${preset.name}`, 'template');
    setConceptNote(`Template pra-cetak ${preset.name} siap pakai.`);
  };

  // Duplicate / Resize
  const handleApplyResize = (targetPreset: SizePreset, adaptedSvg: string) => {
    setCategory(targetPreset.category);
    setWidth(targetPreset.width);
    setHeight(targetPreset.height);
    setUnit(targetPreset.unit);
    setDpi(targetPreset.defaultDpi);
    pushNewVersion(
      adaptedSvg,
      `Duplikat ke ukuran ${targetPreset.name}`,
      'duplicate'
    );
    setConceptNote(`Desain disesuaikan ke format ${targetPreset.name}.`);
  };

  // Apply Business Profile to Form
  const handleApplyBusinessProfile = () => {
    setStructuredData((prev) => ({
      ...prev,
      businessName: businessProfile.businessName || prev.businessName,
      subheadline: businessProfile.tagline || prev.subheadline,
      contactInfo: businessProfile.phone || prev.contactInfo,
      address: businessProfile.address || prev.address,
    }));
    if (businessProfile.logoBase64) {
      setUploadedLogo(businessProfile.logoBase64);
    }
    if (businessProfile.primaryColor) {
      setPrimaryColor(businessProfile.primaryColor);
    }
  };

  // Save Business Profile
  const handleSaveProfile = (newProfile: BusinessProfile) => {
    setBusinessProfile(newProfile);
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(newProfile));
    } catch (e) {
      console.error('Gagal menyimpan profil usaha:', e);
    }
  };

  // Export handlers
  const handleExport = (format: 'svg' | 'png' | 'pdf' | 'jpg') => {
    const filename = `${projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.${format}`;
    if (format === 'svg') {
      downloadSvg(svgString, filename);
    } else if (format === 'png') {
      exportToPng(svgString, dimensions, filename);
    } else if (format === 'jpg') {
      exportToJpg(svgString, dimensions, filename);
    } else if (format === 'pdf') {
      exportToPdf(svgString, dimensions, filename);
    }
  };

  // WhatsApp share
  const handleShareWhatsApp = () => {
    const waUrl = formatWhatsAppShare(
      projectName,
      category,
      width,
      height,
      unit,
      conceptNote
    );
    window.open(waUrl, '_blank');
  };

  // Project management handlers
  const handleSelectProject = (project: DesignProject) => {
    setProjectId(project.id);
    setProjectName(project.name);
    setCustomerName(project.customerName);
    setCategory(project.category);
    setWidth(project.width);
    setHeight(project.height);
    setUnit(project.unit);
    setDpi(project.dpi);
    setBleedMm(project.bleedMm);
    setSafeAreaMm(project.safeAreaMm);
    setSelectedStyle(project.style);
    setPrimaryColor(project.primaryColor);
    setSvgString(project.currentSvg);
    setConceptNote(project.conceptNote);
    setFontAndPaletteAdvice(project.fontAndPaletteAdvice);
    setVersions(project.versions || []);
    setCurrentVersionIndex(0);
    setIsFavorite(project.isFavorite || false);
  };

  const handleDeleteProject = (pId: string) => {
    setProjectsList((prev) => {
      const updated = prev.filter((p) => p.id !== pId);
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(updated));
      return updated;
    });
  };

  const handleToggleProjectFavorite = (pId: string) => {
    setProjectsList((prev) => {
      const updated = prev.map((p) =>
        p.id === pId ? { ...p, isFavorite: !p.isFavorite } : p
      );
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(updated));
      return updated;
    });
    if (pId === projectId) {
      setIsFavorite(!isFavorite);
    }
  };

  const handleCreateNewProject = () => {
    const newId = `project-${Date.now()}`;
    setProjectId(newId);
    setProjectName('Proyek Cetak Baru');
    setCustomerName('Umum');
    setIsFavorite(false);
    const initialSvg = getStarterTemplate('banner', 300, 100, '#4F46E5');
    setSvgString(initialSvg);
    setVersions([
      {
        id: `v-${Date.now()}`,
        timestamp: Date.now(),
        svg: initialSvg,
        summary: 'Proyek baru',
        source: 'template',
      },
    ]);
    setCurrentVersionIndex(0);
  };

  return (
    <div
      className={`w-screen h-screen flex flex-col font-sans transition-colors overflow-hidden ${
        isDarkMode ? 'bg-[#0F1117] text-[#F3F4F6]' : 'bg-[#F8FAFC] text-slate-800'
      }`}
    >
      {/* Global Header */}
      <Header
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        projectName={projectName}
        onChangeProjectName={(name) => {
          setProjectName(name);
          saveCurrentProjectToStorage();
        }}
        onOpenProjects={() => setShowProjects(true)}
        onOpenCalculator={() => setShowCalculator(true)}
        onOpenBusinessProfile={() => setShowBusinessProfile(true)}
        onOpenTemplates={() => setShowTemplates(true)}
        onShareWhatsApp={handleShareWhatsApp}
        onExport={handleExport}
        svgString={svgString}
        isFavorite={isFavorite}
        onToggleFavorite={() => {
          setIsFavorite(!isFavorite);
          handleToggleProjectFavorite(projectId);
        }}
      />

      {/* Main Studio 3-Panel Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Panel Kiri: Pengaturan & Generate */}
        <div
          className={`${
            mobileTab === 'input' ? 'flex' : 'hidden'
          } md:flex h-full w-full md:w-auto shrink-0 z-20 md:static absolute inset-0`}
        >
          <SidebarLeft
            isDarkMode={isDarkMode}
            category={category}
            onSelectCategory={handleSelectCategory}
            width={width}
            height={height}
            unit={unit}
            dpi={dpi}
            bleedMm={bleedMm}
            safeAreaMm={safeAreaMm}
            onUpdateDimensions={(params) => {
              if (params.width !== undefined) setWidth(params.width);
              if (params.height !== undefined) setHeight(params.height);
              if (params.unit !== undefined) setUnit(params.unit);
              if (params.dpi !== undefined) setDpi(params.dpi);
              if (params.bleedMm !== undefined) setBleedMm(params.bleedMm);
              if (params.safeAreaMm !== undefined) setSafeAreaMm(params.safeAreaMm);
            }}
            inputMode={inputMode}
            onChangeInputMode={setInputMode}
            description={description}
            onChangeDescription={setDescription}
            structuredData={structuredData}
            onChangeStructuredData={setStructuredData}
            selectedStyle={selectedStyle}
            onSelectStyle={setSelectedStyle}
            primaryColor={primaryColor}
            onSelectColor={setPrimaryColor}
            uploadedLogo={uploadedLogo}
            onUploadLogo={setUploadedLogo}
            uploadedPhoto={uploadedPhoto}
            onUploadPhoto={setUploadedPhoto}
            businessProfile={businessProfile}
            onApplyBusinessProfile={handleApplyBusinessProfile}
            isGenerating={isGenerating}
            generationStatusText={generationStatusText}
            onGenerate={() => handleGenerate(false)}
            onMakeVariation={() => handleGenerate(true)}
            canMakeVariation={versions.length > 0}
          />
        </div>

        {/* Panel Tengah: Kanvas Desain */}
        <div
          className={`${
            mobileTab === 'canvas' ? 'flex' : 'hidden'
          } md:flex flex-1 h-full overflow-hidden`}
        >
          <CanvasCenter
            isDarkMode={isDarkMode}
            svgString={svgString}
            dimensions={dimensions}
            conceptNote={conceptNote}
            fontAndPaletteAdvice={fontAndPaletteAdvice}
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onOpenMockup={() => setShowMockup(true)}
            onOpenCompare={() => setShowCompare(true)}
            onOpenResizeModal={() => setShowResize(true)}
            selectedElementId={selectedElementId}
            onSelectElement={(id) => {
              setSelectedElementId(id);
              if (id) {
                setRightPanelTab('properties');
                if (window.innerWidth < 768) {
                  setMobileTab('revision');
                }
              }
            }}
            isGenerating={isGenerating}
            generationStatusText={generationStatusText}
            errorMessage={errorMessage}
            onRetry={() => handleGenerate(false)}
          />
        </div>

        {/* Panel Kanan: Revisi Chat & Properti */}
        <div
          className={`${
            mobileTab === 'revision' ? 'flex' : 'hidden'
          } md:flex h-full w-full md:w-auto shrink-0 z-20 md:static absolute inset-0`}
        >
          <SidebarRight
            isDarkMode={isDarkMode}
            activeTab={rightPanelTab}
            onChangeTab={setRightPanelTab}
            chatMessages={chatMessages}
            onSendChatMessage={handleSendChatMessage}
            isRevising={isRevising}
            editableElements={editableElements}
            selectedElementId={selectedElementId}
            onSelectElement={setSelectedElementId}
            onUpdateElementText={handleUpdateElementText}
            versions={versions}
            currentVersionId={versions[currentVersionIndex]?.id || ''}
            onRestoreVersion={(ver) => {
              const idx = versions.findIndex((v) => v.id === ver.id);
              if (idx >= 0) {
                setCurrentVersionIndex(idx);
                setSvgString(ver.svg);
              }
            }}
          />
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div
        className={`md:hidden h-14 border-t flex items-center justify-around z-30 shrink-0 ${
          isDarkMode
            ? 'bg-[#171A23] border-[#2A2F3C] text-gray-300'
            : 'bg-white border-slate-200 text-slate-700'
        }`}
      >
        <button
          onClick={() => setMobileTab('input')}
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold py-1 px-4 ${
            mobileTab === 'input' ? 'text-indigo-400' : 'text-gray-400'
          }`}
        >
          <Sliders size={18} />
          <span>Pengaturan</span>
        </button>

        <button
          onClick={() => setMobileTab('canvas')}
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold py-1 px-4 ${
            mobileTab === 'canvas' ? 'text-indigo-400' : 'text-gray-400'
          }`}
        >
          <Eye size={18} />
          <span>Kanvas</span>
        </button>

        <button
          onClick={() => setMobileTab('revision')}
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold py-1 px-4 ${
            mobileTab === 'revision' ? 'text-indigo-400' : 'text-gray-400'
          }`}
        >
          <MessageSquare size={18} />
          <span>Revisi &amp; Edit</span>
        </button>
      </div>

      {/* Interactive Modals */}
      <MockupModal
        isOpen={showMockup}
        onClose={() => setShowMockup(false)}
        svgString={svgString}
        category={category}
        isDarkMode={isDarkMode}
      />

      <CompareModal
        isOpen={showCompare}
        onClose={() => setShowCompare(false)}
        versions={versions}
        currentVersionId={versions[currentVersionIndex]?.id || ''}
        onSelectVersion={(ver) => {
          const idx = versions.findIndex((v) => v.id === ver.id);
          if (idx >= 0) {
            setCurrentVersionIndex(idx);
            setSvgString(ver.svg);
          }
        }}
        isDarkMode={isDarkMode}
      />

      <ResizeDuplicateModal
        isOpen={showResize}
        onClose={() => setShowResize(false)}
        currentCategory={category}
        currentWidth={width}
        currentHeight={height}
        currentUnit={unit}
        currentSvg={svgString}
        onApplyResize={handleApplyResize}
        isDarkMode={isDarkMode}
      />

      <CalculatorModal
        isOpen={showCalculator}
        onClose={() => setShowCalculator(false)}
        dimensions={dimensions}
        category={category}
        isDarkMode={isDarkMode}
      />

      <BusinessProfileModal
        isOpen={showBusinessProfile}
        onClose={() => setShowBusinessProfile(false)}
        profile={businessProfile}
        onSaveProfile={handleSaveProfile}
        isDarkMode={isDarkMode}
      />

      <ProjectsModal
        isOpen={showProjects}
        onClose={() => setShowProjects(false)}
        projects={projectsList}
        currentProjectId={projectId}
        onSelectProject={handleSelectProject}
        onDeleteProject={handleDeleteProject}
        onToggleFavorite={handleToggleProjectFavorite}
        onCreateNewProject={handleCreateNewProject}
        isDarkMode={isDarkMode}
      />

      <TemplatesModal
        isOpen={showTemplates}
        onClose={() => setShowTemplates(false)}
        onSelectTemplate={handleSelectTemplate}
        isDarkMode={isDarkMode}
        primaryColor={primaryColor}
      />
    </div>
  );
}
