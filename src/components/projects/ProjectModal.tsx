// ============================================================
//  components/projects/ProjectModal.tsx — RESPONSIVE
// ============================================================

import { useState, useEffect } from 'react';
import type { Project } from '../../types';
import { useProjects } from '../../hooks/useProjects';
import { Modal, FormField, inputClass } from '../ui/index';
import { Button } from '../ui/Button';

const EMOJI_OPTIONS = ['📁','🚀','🎯','💡','🛠️','📊','🎨','📱','🔬','⚡','🏗️','📝','🌐','🎓','💼'];
const COLOR_OPTIONS = ['#E8C547','#4CAF7D','#4A90D9','#E85447','#9B72CF','#E8834A','#38BDF8','#F472B6'];

const DEFAULT_FORM = { name: '', description: '', emoji: '📁', color: '#E8C547', startDate: '', endDate: '' };

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  editProject?: Project | null;
}

export function ProjectModal({ isOpen, onClose, editProject }: ProjectModalProps) {
  const { addProject, updateProject } = useProjects();
  const [form, setForm] = useState(DEFAULT_FORM);

  useEffect(() => {
    if (editProject) {
      setForm({ name: editProject.name, description: editProject.description, emoji: editProject.emoji, color: editProject.color, startDate: editProject.startDate ?? '', endDate: editProject.endDate ?? '' });
    } else {
      setForm(DEFAULT_FORM);
    }
  }, [editProject, isOpen]);

  function handleChange(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit() {
    if (!form.name.trim()) return;
    editProject ? updateProject(editProject.id, form) : addProject(form);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editProject ? 'Modifier le projet' : 'Nouveau projet'}>
      <div className="flex flex-col gap-4">
        <FormField label="Nom du projet *">
          <input className={inputClass} placeholder="Ex: Refonte site web" value={form.name}
            onChange={(e) => handleChange('name', e.target.value)} autoFocus />
        </FormField>

        <FormField label="Description">
          <textarea className={`${inputClass} resize-none h-16 sm:h-20`} placeholder="Décrivez l'objectif…"
            value={form.description} onChange={(e) => handleChange('description', e.target.value)} />
        </FormField>

        {/* Dates — colonne sur très petit écran */}
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
          <FormField label="Date de début">
            <input type="date" className={inputClass} value={form.startDate} onChange={(e) => handleChange('startDate', e.target.value)} />
          </FormField>
          <FormField label="Date de fin">
            <input type="date" className={inputClass} value={form.endDate} onChange={(e) => handleChange('endDate', e.target.value)} />
          </FormField>
        </div>

        {/* Emojis */}
        <FormField label="Icône">
          <div className="flex flex-wrap gap-2 mt-1">
            {EMOJI_OPTIONS.map((emoji) => (
              <button key={emoji} onClick={() => handleChange('emoji', emoji)}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-base sm:text-lg transition border ${form.emoji === emoji ? 'border-yellow-400 bg-yellow-400/10' : 'border-zinc-700 bg-zinc-800 hover:border-zinc-500'}`}>
                {emoji}
              </button>
            ))}
          </div>
        </FormField>

        {/* Couleurs */}
        <FormField label="Couleur">
          <div className="flex gap-2.5 mt-1 flex-wrap">
            {COLOR_OPTIONS.map((color) => (
              <button key={color} onClick={() => handleChange('color', color)}
                className={`w-6 h-6 rounded-full transition-transform ${form.color === color ? 'scale-125 ring-2 ring-offset-2 ring-offset-zinc-900 ring-white' : ''}`}
                style={{ background: color }} />
            ))}
          </div>
        </FormField>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>Annuler</Button>
          <Button onClick={handleSubmit} disabled={!form.name.trim()}>
            {editProject ? 'Enregistrer' : 'Créer le projet'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
