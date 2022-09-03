import { useContext } from "react"
import { StoryNavigationContext } from "../context/StoryNavigationContext";

export const useStoryNavigation = () => {
  const context = useContext(StoryNavigationContext);

  if (context === undefined) {
    throw new Error("useStoryNavigation() must be used inside a StoryNavigationProvider");
  }

  return context;
}