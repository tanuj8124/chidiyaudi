'use client';

import React, { useEffect, useState } from 'react';

interface TimerProps {
  duration: number; // milliseconds
  onTimeUp: () => void;
  isRunning?: boolean;
}

export function Timer({ duration, onTimeUp, isRunning = true }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 100;
        if (newTime <= 0) {
          onTimeUp();
          return 0;
        }
        return newTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, onTimeUp, duration]);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  const percentage = Math.max(0, (timeLeft / duration) * 100);

  return (
    <div className="w-full">
      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all ${
            percentage > 33 ? 'bg-green-500' : percentage > 16 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="text-center mt-2 text-sm font-semibold text-gray-600">
        {(timeLeft / 1000).toFixed(1)}s
      </div>
    </div>
  );
}
