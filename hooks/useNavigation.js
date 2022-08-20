import { useContext } from "react"
import { NavigationContext } from "../context/NavigationContext"

export const useNavigation = () => {
  const context = useContext(NavigationContext);

  if (context === undefined) {
    throw new Error("useNavigation() must be used inside a NavigationProvider");
  }

  return context;
}