/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, FolderOpen, Search, Star, Trash2, Plus, ArrowRight } from 'lucide-react';
import { DesignProject } from '../types/design';

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: DesignProject[];
  currentProjectId: string;
  onSelectProject: (project: DesignProject) => void;
  onDeleteProject: (projectId: string) => void;
  onToggleFavorite: (projectId: string) => void;
  onCreateNewProject: () => void;
  isDarkMode: boolean;
}

export const ProjectsModal: React.FC<ProjectsModalProps> = ({
  isOpen,
  onClose,
  projects,
  currentProjectId,
  onSelectProject,
  onDeleteProject,
  onToggleFavorite,
  onCreateNewProject,
  isDarkMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className={`w-full max-w-2xl max-h-[88vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden ${
          isDarkMode
            ? 'bg-[#171A23] border-[#2A2F3C] text-[#F3F4F6]'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen size={18} className="text-amber-400" />
            <h3 className="font-bold text-base">Manajemen Proyek &amp; Pesanan</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-500/20 text-gray-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search & Actions Bar */}
        <div className="px-6 py-3 border-b border-gray-500/20 flex items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari proyek atau nama pelanggan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-3 py-1.5 rounded-lg border text-xs outline-none focus:ring-1 focus:ring-indigo-500 ${
                isDarkMode ? 'bg-[#0F1117] border-[#2A2F3C]' : 'bg-slate-50 border-slate-200'
              }`}
            />
          </div>

          <button
            onClick={() => {
              onCreateNewProject();
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shrink-0 shadow-sm"
          >
            <Plus size={14} />
            <span>Proyek Baru</span>
          </button>
        </div>

        {/* Project List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2.5 text-xs">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12 text-gray-400 space-y-2">
              <FolderOpen size={32} className="mx-auto opacity-30" />
              <p>Belum ada proyek yang cocok atau tersimpan.</p>
            </div>
          ) : (
            filteredProjects.map((p) => {
              const isCurrent = p.id === currentProjectId;
              return (
                <div
                  key={p.id}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    isCurrent
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : isDarkMode
                      ? 'border-[#2A2F3C] bg-[#0F1117] hover:border-gray-600'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-gray-100 truncate">{p.name}</span>
                      {isCurrent && (
                        <span className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded font-medium">
                          Sedang Dibuka
                        </span>
                      )}
                      {p.isFavorite && (
                        <Star size={13} fill="#F59E0B" className="text-amber-400 shrink-0" />
                      )}
                    </div>

                    <div className="text-gray-400 flex flex-wrap gap-x-3 text-[11px] font-mono">
                      <span>Pelanggan: {p.customerName || 'Umum'}</span>
                      <span>•</span>
                      <span>
                        {p.width} × {p.height} {p.unit} ({p.category})
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(p.updatedAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onToggleFavorite(p.id)}
                      className="p-1.5 rounded hover:bg-gray-500/20 text-gray-400 hover:text-amber-400"
                      title="Favorit"
                    >
                      <Star size={15} fill={p.isFavorite ? 'currentColor' : 'none'} />
                    </button>

                    <button
                      onClick={() => onDeleteProject(p.id)}
                      className="p-1.5 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400"
                      title="Hapus Proyek"
                    >
                      <Trash2 size={15} />
                    </button>

                    <button
                      onClick={() => {
                        onSelectProject(p);
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold flex items-center gap-1 shadow-sm"
                    >
                      <span>Buka</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-500/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs font-semibold"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
