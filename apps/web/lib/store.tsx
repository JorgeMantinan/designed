'use client';

import { createContext, useContext, useReducer } from 'react';
import type { Dispatch, ReactNode } from 'react';

import type { BuilderAction, BuilderState, Selection } from './store-core';
import { builderReducer, createInitialState } from './store-core';

// Pure state logic lives in store-core (no JSX) so tests can import it.
export * from './store-core';

interface BuilderContextValue {
  state: BuilderState;
  dispatch: Dispatch<BuilderAction>;
}

const BuilderContext = createContext<BuilderContextValue | null>(null);

export function BuilderProvider({
  initialSpec,
  children,
}: {
  initialSpec: BuilderState['spec'];
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(builderReducer, initialSpec, createInitialState);

  return <BuilderContext.Provider value={{ state, dispatch }}>{children}</BuilderContext.Provider>;
}

export function useBuilder(): BuilderContextValue {
  const context = useContext(BuilderContext);
  if (!context) throw new Error('useBuilder debe usarse dentro de <BuilderProvider>');
  return context;
}

export type { BuilderAction, BuilderState, Selection };
