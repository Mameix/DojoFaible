import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Edit } from 'lucide-react';
import { Candidate } from '../types';
import { motion } from 'framer-motion';

interface CandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidates: Candidate[];
  onSave: (candidates: Candidate[]) => void;
}

export const CandidateModal: React.FC<CandidateModalProps> = ({
  isOpen,
  onClose,
  candidates,
  onSave,
}) => {
  const [localCandidates, setLocalCandidates] = useState<Candidate[]>([]);
  const [newCandidate, setNewCandidate] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    setLocalCandidates(candidates);
  }, [candidates]);

  const handleAddCandidate = () => {
    if (newCandidate.trim() === '') return;
    if (localCandidates.length >= 8) {
      alert('Maximum 8 candidats autorisés');
      return;
    }

    const newId = Date.now().toString();
    setLocalCandidates([
      ...localCandidates,
      {
        id: newId,
        name: newCandidate,
        isActive: true,
        isCurrentPlayer: localCandidates.length === 0,
      },
    ]);
    setNewCandidate('');
  };

  const handleRemoveCandidate = (id: string) => {
    setLocalCandidates(localCandidates.filter((c) => c.id !== id));
  };

  const handleToggleActive = (id: string) => {
    setLocalCandidates(
      localCandidates.map((c) =>
        c.id === id ? { ...c, isActive: !c.isActive } : c
      )
    );
  };

  const handleSetCurrentPlayer = (id: string) => {
    setLocalCandidates(
      localCandidates.map((c) => ({
        ...c,
        isCurrentPlayer: c.id === id,
      }))
    );
  };

  const handleStartEdit = (candidate: Candidate) => {
    setEditingId(candidate.id);
    setEditName(candidate.name);
  };

  const handleSaveEdit = () => {
    if (editName.trim() === '') return;
    
    setLocalCandidates(
      localCandidates.map((c) =>
        c.id === editingId ? { ...c, name: editName } : c
      )
    );
    setEditingId(null);
    setEditName('');
  };

  const handleSave = () => {
    onSave(localCandidates);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Gestion des candidats</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newCandidate}
              onChange={(e) => setNewCandidate(e.target.value)}
              placeholder="Nom du candidat"
              className="flex-1 px-3 py-2 bg-gray-700 rounded-md text-white"
              onKeyDown={(e) => e.key === 'Enter' && handleAddCandidate()}
            />
            <button
              onClick={handleAddCandidate}
              className="bg-green-600 hover:bg-green-500 text-white p-2 rounded-md transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        <div className="max-h-[300px] overflow-y-auto">
          {localCandidates.length === 0 ? (
            <p className="text-gray-400 text-center py-4">
              Aucun candidat. Ajoutez-en pour commencer.
            </p>
          ) : (
            <ul className="space-y-2">
              {localCandidates.map((candidate) => (
                <li
                  key={candidate.id}
                  className={`bg-gray-700 rounded-md p-3 ${
                    !candidate.isActive ? 'opacity-60' : ''
                  } ${
                    candidate.isCurrentPlayer ? 'border-l-4 border-yellow-400' : ''
                  }`}
                >
                  {editingId === candidate.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 px-3 py-1 bg-gray-600 rounded-md text-white"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                      />
                      <button
                        onClick={handleSaveEdit}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-md text-sm transition-colors"
                      >
                        OK
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{candidate.name}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleActive(candidate.id)}
                          className={`px-2 py-1 rounded-md text-xs ${
                            candidate.isActive
                              ? 'bg-green-600 hover:bg-green-500'
                              : 'bg-red-600 hover:bg-red-500'
                          } transition-colors`}
                        >
                          {candidate.isActive ? 'Actif' : 'Éliminé'}
                        </button>
                        <button
                          onClick={() => handleSetCurrentPlayer(candidate.id)}
                          className={`px-2 py-1 rounded-md text-xs ${
                            candidate.isCurrentPlayer
                              ? 'bg-yellow-600'
                              : 'bg-gray-600 hover:bg-gray-500'
                          } transition-colors`}
                          disabled={candidate.isCurrentPlayer}
                        >
                          Joueur
                        </button>
                        <button
                          onClick={() => handleStartEdit(candidate)}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleRemoveCandidate(candidate.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-red-900 hover:bg-red-800 rounded-md transition-colors"
          >
            Enregistrer
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};