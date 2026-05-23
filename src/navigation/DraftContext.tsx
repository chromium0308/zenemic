import React, { createContext, useContext, useState } from 'react';
import type { Draft } from './types';

type Ctx = { draft: Draft; setDraft: (d: Draft) => void };

const DraftCtx = createContext<Ctx | null>(null);

export function DraftProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<Draft>({});
  return <DraftCtx.Provider value={{ draft, setDraft }}>{children}</DraftCtx.Provider>;
}

export function useDraft(): Ctx {
  const ctx = useContext(DraftCtx);
  if (!ctx) throw new Error('useDraft must be used inside DraftProvider');
  return ctx;
}
