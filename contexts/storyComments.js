import { createContext, useContext } from "react";

const StoryCommentsContext = createContext(null);

const useStoryComments = () => useContext(StoryCommentsContext);

export { StoryCommentsContext, useStoryComments };