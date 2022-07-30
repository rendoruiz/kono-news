import React from 'react';

const NavigationContext = React.createContext(null);
const useNavigation = () => React.useContext(NavigationContext);

export { NavigationContext, useNavigation }