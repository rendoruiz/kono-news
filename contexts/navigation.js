import { createContext, useContext } from "react";

const NavigationContext = createContext(null);

const useNavigation = () => useContext(NavigationContext);

export { NavigationContext, useNavigation };