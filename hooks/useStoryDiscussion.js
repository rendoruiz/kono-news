import { useContext } from "react"
import { StoryDiscussionContext } from "../context/StoryDiscussionContext";

export const useStoryDiscussion = () => {
  const context = useContext(StoryDiscussionContext);

  if (context === undefined) {
    throw new Error("useStoryDiscussion() must be used inside a StoryDiscussionProvider");
  }

  return context;
}