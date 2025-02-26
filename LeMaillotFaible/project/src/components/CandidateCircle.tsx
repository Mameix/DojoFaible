import React from 'react';
import { Candidate } from '../types';
import { cn } from '../utils/cn';

interface CandidateCircleProps {
  candidates: Candidate[];
}

export const CandidateCircle: React.FC<CandidateCircleProps> = ({ candidates }) => {
  return (
    <div className="relative w-[600px] h-[600px] mx-auto">
      {candidates.map((candidate, index) => {
        const angle = (index * (360 / candidates.length) * Math.PI) / 180;
        const radius = 250;
        const left = radius * Math.cos(angle) + radius;
        const top = radius * Math.sin(angle) + radius;

        return (
          <div
            key={candidate.id}
            className={cn(
              "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300",
              "p-4 rounded-lg text-center min-w-[120px]",
              candidate.isActive ? "bg-gray-800 text-white" : "bg-red-900/50 text-gray-500",
              candidate.isCurrentPlayer && "ring-2 ring-yellow-400"
            )}
            style={{
              left: `${left}px`,
              top: `${top}px`,
            }}
          >
            {candidate.name}
          </div>
        );
      })}
    </div>
  );
};