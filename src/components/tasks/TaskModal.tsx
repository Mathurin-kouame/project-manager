// ============================================================
//  components/tasks/TaskModal.tsx
//  Formulaire de création / édition d'une tâche
// ============================================================

import { useState, useEffect } from 'react';
import type { Task, Priority } from '../../types';
import { useTasks } from '../../hooks/useTasks';
import { useApp } from '../../store/AppContext';
import { Modal, FormField, inputClass } from '../ui/index';
import { Button } from '../ui/Button';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  editTask?: Task | null;
  defaultProjectId?: string | null;
}

const DEFAULT_FORM = {
  projectId: '',
  title: '',
  description: '',
  priority: 'medium' as Priority,
  dueDate: '',
};

export function TaskModal({ isOpen, onClose, editTask, defaultProjectId }: TaskModalProps) {
  const { state } = useApp();
  const { addTask, updateTask } = useTasks();
  const [form, setForm] = useState(DEFAULT_FORM);

  // Pré-remplissage selon le mode (création / édition)
  useEffect(() => {
    if (editTask) {
      setForm({
        projectId:   editTask.projectId,
        title:       editTask.title,
        description: editTask.description,
        priority:    editTask.priority,
        dueDate:     editTask.dueDate ?? '',
      });
    } else {
      setForm({
        ...DEFAULT_FORM,
        projectId: defaultProjectId ?? state.projects[0]?.id ?? '',
      });
    }
  }, [editTask, isOpen, defaultProjectId, state.projects]);

  function handleChange<K extends keyof typeof form>(field: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit() {
    if (!form.title.trim() || !form.projectId) return;

    if (editTask) {
      updateTask(editTask.id, form);
    } else {
      addTask(form);
    }
    onClose();
  }

  const isEditing = !!editTask;
  const hasProjects = state.projects.length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Modifier la tâche' : 'Nouvelle tâche'}
    >
      {!hasProjects ? (
        // Cas particulier : pas encore de projet
        <div className="text-center py-6 text-zinc-500">
          <p className="text-3xl mb-3">📂</p>
          <p className="font-semibold text-zinc-300">Aucun projet</p>
          <p className="text-sm mt-1">Créez d'abord un projet pour y ajouter des tâches.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">

          {/* Sélection du projet */}
          <FormField label="Projet *">
            <select
              className={inputClass}
              value={form.projectId}
              onChange={(e) => handleChange('projectId', e.target.value)}
            >
              {state.projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.emoji} {p.name}
                </option>
              ))}
            </select>
          </FormField>

          {/* Titre */}
          <FormField label="Titre *">
            <input
              className={inputClass}
              placeholder="Décrivez la tâche…"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              autoFocus
            />
          </FormField>

          {/* Description */}
          <FormField label="Description">
            <textarea
              className={`${inputClass} resize-none h-16`}
              placeholder="Détails optionnels…"
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </FormField>

          {/* Priorité + Date */}
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Priorité">
              <select
                className={inputClass}
                value={form.priority}
                onChange={(e) => handleChange('priority', e.target.value as Priority)}
              >
                <option value="low">🟢 Basse</option>
                <option value="medium">🟠 Moyenne</option>
                <option value="high">🔴 Haute</option>
              </select>
            </FormField>

            <FormField label="Échéance">
              <input
                type="date"
                className={inputClass}
                value={form.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
              />
            </FormField>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={onClose}>Annuler</Button>
            <Button onClick={handleSubmit} disabled={!form.title.trim()}>
              {isEditing ? 'Enregistrer' : 'Ajouter la tâche'}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
