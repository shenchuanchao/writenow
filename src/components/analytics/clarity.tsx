'use client';

import { useEffect } from 'react';
import clarity from '@microsoft/clarity';

const CLARITY_PROJECT_ID = 'xfjjocqluh';

export function ClarityAnalytics() {
  useEffect(() => {
    if (typeof window !== 'undefined' && CLARITY_PROJECT_ID) {
      clarity.init(CLARITY_PROJECT_ID);
    }
  }, []);

  return null;
}