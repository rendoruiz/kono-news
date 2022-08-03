import React from 'react';

const StoryContext = React.createContext(null);
const useStory = () => React.useContext(StoryContext);

export { StoryContext, useStory }