'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { PlaybackState } from '../types';

interface UsePlaybackOptions {
  onTick?: (currentTime: number) => void;
  duration?: number; // Total playback duration in milliseconds
}

const DEFAULT_DURATION = 8 * 60 * 60 * 1000; // 8 hours (a shift)

export function usePlayback(options: UsePlaybackOptions = {}) {
  const { onTick, duration = DEFAULT_DURATION } = options;

  const now = Date.now();
  const shiftStart = new Date(now);
  shiftStart.setHours(6, 0, 0, 0);

  const [state, setState] = useState<PlaybackState>({
    isPlaying: false,
    speed: 1,
    currentTime: now,
    startTime: shiftStart.getTime(),
    endTime: shiftStart.getTime() + duration,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onTickRef = useRef(onTick);
  onTickRef.current = onTick;

  // Playback loop
  useEffect(() => {
    if (!state.isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const tickInterval = 100; // Update every 100ms
    const timeIncrement = tickInterval * state.speed;

    intervalRef.current = setInterval(() => {
      setState((prev) => {
        const nextTime = prev.currentTime + timeIncrement;

        // Loop back to start if we've reached the end
        if (nextTime >= prev.endTime) {
          return { ...prev, currentTime: prev.startTime };
        }

        if (onTickRef.current) {
          onTickRef.current(nextTime);
        }

        return { ...prev, currentTime: nextTime };
      });
    }, tickInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isPlaying, state.speed]);

  // Control functions
  const play = useCallback(() => {
    setState((prev) => ({ ...prev, isPlaying: true }));
  }, []);

  const pause = useCallback(() => {
    setState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  const toggle = useCallback(() => {
    setState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, []);

  const setSpeed = useCallback((speed: PlaybackState['speed']) => {
    setState((prev) => ({ ...prev, speed }));
  }, []);

  const seek = useCallback((time: number) => {
    setState((prev) => ({
      ...prev,
      currentTime: Math.max(prev.startTime, Math.min(prev.endTime, time)),
    }));
  }, []);

  const seekToStart = useCallback(() => {
    setState((prev) => ({ ...prev, currentTime: prev.startTime }));
  }, []);

  const seekToEnd = useCallback(() => {
    setState((prev) => ({ ...prev, currentTime: prev.endTime }));
  }, []);

  const setTimeRange = useCallback((startTime: number, endTime: number) => {
    setState((prev) => ({
      ...prev,
      startTime,
      endTime,
      currentTime: Math.max(startTime, Math.min(endTime, prev.currentTime)),
    }));
  }, []);

  // Derived values
  const progress = (state.currentTime - state.startTime) / (state.endTime - state.startTime);
  const elapsedMs = state.currentTime - state.startTime;
  const remainingMs = state.endTime - state.currentTime;

  // Format time for display
  const formatTime = useCallback((timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }, []);

  const formatDuration = useCallback((ms: number) => {
    const hours = Math.floor(ms / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    return `${hours}h ${minutes}m`;
  }, []);

  return {
    state,
    progress,
    elapsedMs,
    remainingMs,
    play,
    pause,
    toggle,
    setSpeed,
    seek,
    seekToStart,
    seekToEnd,
    setTimeRange,
    formatTime,
    formatDuration,
    currentTimeFormatted: formatTime(state.currentTime),
    startTimeFormatted: formatTime(state.startTime),
    endTimeFormatted: formatTime(state.endTime),
  };
}
