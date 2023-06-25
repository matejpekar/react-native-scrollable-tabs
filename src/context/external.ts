import { createContext } from 'react';
import type { ScrollableTabsMethods, ScrollableTabsVariables } from '../types';

export const ScrollableTabsContext = createContext<
  (ScrollableTabsMethods & ScrollableTabsVariables) | null
>(null);

export const ScrollableTabsProvider = ScrollableTabsContext.Provider;
