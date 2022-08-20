import { createContext } from 'react';

export const StoryDiscussionContext = createContext(null);

export const StoryDiscussionProvider = ({ children, value }) => {

  return (
    <StoryDiscussionContext.Provider value={value}>
      {children}
    </StoryDiscussionContext.Provider>
  );
}