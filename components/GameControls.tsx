'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface GameControlsProps {
  onUp: () => void;
  onDown: () => void;
  disabled?: boolean;
}

export function GameControls({ onUp, onDown, disabled = false }: GameControlsProps) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (disabled) return;
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        onUp();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        onDown();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onUp, onDown, disabled]);

  return (
    <div className="flex gap-4 justify-center mt-8">
      <Button
        onClick={onUp}
        disabled={disabled}
        size="lg"
        className="h-20 w-20 text-2xl bg-green-600 hover:bg-green-700 text-white rounded-full"
      >
        <span className="text-3xl">⬆️</span>
      </Button>
      <Button
        onClick={onDown}
        disabled={disabled}
        size="lg"
        className="h-20 w-20 text-2xl bg-red-600 hover:bg-red-700 text-white rounded-full"
      >
        <span className="text-3xl">⬇️</span>
      </Button>
    </div>
  );
}
