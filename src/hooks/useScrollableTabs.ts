import { useContext } from 'react';
import { ScrollableTabsContext } from '../context/external';

export const useScrollableTabs = () => {
  const context = useContext(ScrollableTabsContext);

  if (context === null) {
    throw "'useScrollableTabs' cannot be used out of the ScrollableTabs!";
  }

  return context;
};
