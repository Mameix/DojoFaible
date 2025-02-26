import React, { useState, useCallback } from 'react';
import { Timer } from './components/Timer';
import { MoneyLadder } from './components/MoneyLadder';
import { Bank } from './components/Bank';
import { CandidateCircle } from './components/CandidateCircle';
import { CandidateModal } from './components/CandidateModal';
import { Candidate, GameState, MONEY_LEVELS } from './types';
import { Check, X, Coins, Users } from 'lucide-react';

const INITIAL_CANDIDATES: Candidate[] = [
  { id: '1', name: 'Julie', isActive: true, isCurrentPlayer: true },
  { id: '2', name: 'Thomas', isActive: true, isCurrentPlayer: false },
  { id: '3', name: 'Sophie', isActive: true, isCurrentPlayer: false },
  { id: '4', name: 'Lucas', isActive: true, isCurrentPlayer: false },
  { id: '5', name: 'Emma', isActive: true, isCurrentPlayer: false },
  { id: '6', name: 'Nicolas', isActive: true, isCurrentPlayer: false },
];

function App() {
  const [gameState, setGameState] = useState<GameState>({
    currentAmount: 0,
    bankAmount: 0,
    timeRemaining: 150, // 2:30 in seconds
    isPlaying: false,
    candidates: INITIAL_CANDIDATES,
    currentLevel: 0,
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const moveToNextPlayer = useCallback(() => {
    setGameState(prev => {
      const activeCandidates = prev.candidates.filter(c => c.isActive);
      if (activeCandidates.length <= 1) return prev; // No need to rotate if only one active player
      
      const currentPlayerIndex = activeCandidates.findIndex(c => c.isCurrentPlayer);
      const nextPlayerIndex = (currentPlayerIndex + 1) % activeCandidates.length;
      
      return {
        ...prev,
        candidates: prev.candidates.map(candidate => ({
          ...candidate,
          isCurrentPlayer: candidate.isActive && 
            candidate.id === activeCandidates[nextPlayerIndex].id
        }))
      };
    });
  }, []);

  const handleCorrect = useCallback(() => {
    if (!gameState.isPlaying) return;
    
    setGameState(prev => ({
      ...prev,
      currentLevel: Math.min(prev.currentLevel + 1, MONEY_LEVELS.length - 1),
      currentAmount: MONEY_LEVELS[Math.min(prev.currentLevel + 1, MONEY_LEVELS.length - 1)]
    }));
    
    moveToNextPlayer();
  }, [gameState.isPlaying, moveToNextPlayer]);

  const handleIncorrect = useCallback(() => {
    if (!gameState.isPlaying) return;
    
    setGameState(prev => ({
      ...prev,
      currentLevel: 0,
      currentAmount: 0
    }));
    
    moveToNextPlayer();
  }, [gameState.isPlaying, moveToNextPlayer]);

  const handleBank = useCallback(() => {
    if (!gameState.isPlaying) return;
    
    setGameState(prev => ({
      ...prev,
      bankAmount: prev.bankAmount + prev.currentAmount,
      currentAmount: 0,
      currentLevel: 0
    }));
  }, [gameState.isPlaying]);

  const startGame = () => {
    setGameState(prev => ({ ...prev, isPlaying: true }));
  };

  const handleTimeUp = () => {
    setGameState(prev => ({ ...prev, isPlaying: false }));
  };

  const handleSaveCandidates = (candidates: Candidate[]) => {
    setGameState(prev => ({ ...prev, candidates }));
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'c') handleCorrect();
      if (e.key.toLowerCase() === 'x') handleIncorrect();
      if (e.key.toLowerCase() === 'b') handleBank();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleCorrect, handleIncorrect, handleBank]);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white relative overflow-hidden">
      {!gameState.isPlaying ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <button
            onClick={startGame}
            className="px-8 py-4 bg-red-900 text-white rounded-lg text-xl font-bold hover:bg-red-800 transition-colors"
          >
            Commencer la partie
          </button>
          <button
            onClick={openModal}
            className="px-8 py-4 bg-gray-700 text-white rounded-lg flex items-center gap-2 hover:bg-gray-600 transition-colors"
          >
            <Users size={20} />
            Gérer les candidats
          </button>
        </div>
      ) : (
        <>
          <MoneyLadder currentLevel={gameState.currentLevel} />
          <div className="container mx-auto pt-8">
            <CandidateCircle candidates={gameState.candidates} />
          </div>
          <Bank amount={gameState.bankAmount} />
          <Timer
            initialTime={gameState.timeRemaining}
            isRunning={gameState.isPlaying}
            onTimeUp={handleTimeUp}
          />
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
            <button
              onClick={handleCorrect}
              className="p-4 bg-green-600 rounded-full hover:bg-green-500 transition-colors"
            >
              <Check size={24} />
            </button>
            <button
              onClick={handleBank}
              className="p-4 bg-yellow-600 rounded-full hover:bg-yellow-500 transition-colors"
            >
              <Coins size={24} />
            </button>
            <button
              onClick={handleIncorrect}
              className="p-4 bg-red-600 rounded-full hover:bg-red-500 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <button
            onClick={openModal}
            className="fixed top-4 right-4 p-3 bg-gray-700 text-white rounded-lg flex items-center gap-2 hover:bg-gray-600 transition-colors"
          >
            <Users size={18} />
            Candidats
          </button>
        </>
      )}
      
      <CandidateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        candidates={gameState.candidates}
        onSave={handleSaveCandidates}
      />
    </div>
  );
}

export default App;