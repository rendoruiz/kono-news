import { createContext } from 'react';

export const StoryNavigationContext = createContext(null);

export const StoryNavigationProvider = ({ children }) => {
  return (
    <StoryNavigationContext.Provider value={null}>
      {children}
    </StoryNavigationContext.Provider>
  );
}