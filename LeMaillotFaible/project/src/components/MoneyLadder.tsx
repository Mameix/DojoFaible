import React from 'react';
import { MONEY_LEVELS } from '../types';
import { cn } from '../utils/cn';

interface MoneyLadderProps {
  currentLevel: number;
}

export const MoneyLadder: React.FC<MoneyLadderProps> = ({ currentLevel }) => {
  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 flex flex-col-reverse gap-2">
      {MONEY_LEVELS.map((amount, index) => (
        <div
          key={amount}
          className={cn(
            "px-4 py-2 rounded-full transition-all duration-300",
            index === currentLevel && "bg-red-900 text-white font-bold",
            index < currentLevel && "text-gray-500",
            index > currentLevel && "text-white",
            "min-w-[120px] text-center"
          )}
        >
          {amount}€
        </div>
      ))}
    </div>
  );
};