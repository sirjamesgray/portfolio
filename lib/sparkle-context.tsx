"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface SparkleContextValue {
  sparklesEnabled: boolean;
  setSparklesEnabled: (enabled: boolean) => void;
  toggleSparkles: () => void;
}

const SparkleContext = createContext<SparkleContextValue | undefined>(undefined);

interface SparkleProviderProps {
  children: ReactNode;
  /** Initial state for sparkles. Defaults to false (off). */
  defaultEnabled?: boolean;
}

/**
 * SparkleProvider - Global context to enable/disable sparkles on all cards
 *
 * Wrap your app or section with this provider to control sparkle visibility.
 * Cards that support sparkles will check this context.
 */
export function SparkleProvider({ children, defaultEnabled = false }: SparkleProviderProps) {
  const [sparklesEnabled, setSparklesEnabled] = useState(defaultEnabled);

  const toggleSparkles = () => setSparklesEnabled((prev) => !prev);

  return (
    <SparkleContext.Provider value={{ sparklesEnabled, setSparklesEnabled, toggleSparkles }}>
      {children}
    </SparkleContext.Provider>
  );
}

/**
 * Hook to access the sparkle context
 *
 * Returns sparklesEnabled: false if not within a SparkleProvider
 */
export function useSparkles(): SparkleContextValue {
  const context = useContext(SparkleContext);
  if (!context) {
    // Return a safe default when not in a provider
    return {
      sparklesEnabled: false,
      setSparklesEnabled: () => {},
      toggleSparkles: () => {},
    };
  }
  return context;
}
