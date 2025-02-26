import React, { useEffect, useState } from 'react';
import { cn } from '../utils/cn';

interface TimerProps {
  initialTime: number; // in seconds
  isRunning: boolean;
  onTimeUp: () => void;
  onAlert?: () => void;
}

export const Timer: React.FC<TimerProps> = ({
  initialTime,
  isRunning,
  onTimeUp,
  onAlert
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const isNearEnd = timeLeft <= 10;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 11 && prev > 10 && onAlert) {
            onAlert();
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      onTimeUp();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onTimeUp, onAlert]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div 
      className={cn(
        "fixed bottom-4 right-4 font-mono text-4xl font-bold p-4 rounded-lg transition-colors duration-300",
        isNearEnd ? "text-red-500 animate-pulse" : "text-white"
      )}
    >
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
};