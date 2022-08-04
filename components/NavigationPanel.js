import React from 'react';
import Link from 'next/link';
import { useRouter } from "next/router";
import clsx from "clsx";

import NavigationToggle from "./shared/NavigationToggle";

import { useNavigation } from '../context/NavigationContext';

import { APP_THEME, LOCALSTORAGE_KEY, NAVIGATION_ACTION, NAVIGATION_ITEMS, QUERY_KEY } from "../utils/constants";
import useLocalStorageState from 'use-local-storage-state';

const NavigationPanel = ({
  isExpanded, 
  currentStoryModeId,
}) => (
  <>
    <NavigationPanelOverlay isExpanded={isExpanded} />
    <section className={clsx(
      'fixed z-modal inset-0 right-auto px-1 py-2 w-4/5 min-w-[120px] max-w-[300px] bg-knBackground -translate-x-full transition-transform panel-transition overflow-y-auto pointer-events-none',
      '2xl:absolute 2xl:border-1.5 2xl:border-l-0 2xl:rounded-lg 2xl:rounded-l-none 2xl:opacity-0 2xl:-translate-x-1/4 2xl:transition-all 2xl:duration-200',
      {'translate-x-0 pointer-events-auto': isExpanded},
      {'2xl:opacity-100 2xl:translate-x-0': isExpanded},
    )}>
      <NavigationToggle />
      <NavigationList currentStoryModeId={currentStoryModeId} />
      <NavigationFooter />
    </section>
  </>
);

const NavigationPanelOverlay = ({ isExpanded }) => {
  const dispatch = useNavigation();
  const handleClick = () => dispatch({ type: NAVIGATION_ACTION.TOGGLE_PANEL });

  return (
    <div 
      className={clsx(
        'fixed z-modal inset-0 bg-knModalOverlay opacity-0 transition-opacity panel-transition pointer-events-none',
        '2xl:bg-knModalOverlay/20 2xl:duration-200',
        {'opacity-100 pointer-events-auto': isExpanded},
      )}
      onClick={handleClick}
      title='navigation panel toggleable overlay'
    />
  );
}

const NavigationFooter = () => {
  const [appTheme, setAppTheme] = useLocalStorageState(LOCALSTORAGE_KEY.APP_THEME);

  const toggleTheme = () => {
    if (appTheme === APP_THEME.dark) {
      setAppTheme(APP_THEME.light)
    } else if (appTheme === APP_THEME.light) {
      setAppTheme(APP_THEME.dark)
    }
  }

  // default value on first page visit
  React.useEffect(() => {
    if (!appTheme) {
      setAppTheme(localStorage.getItem(LOCALSTORAGE_KEY.INITIAL_THEME))
    }
  }, []);

  React.useEffect(() => {
    if (appTheme) {
      document.body.className = appTheme;
    }
  }, [appTheme]);

  return (
    <button
      type='button'
      onClick={toggleTheme}
    >
      {appTheme === APP_THEME.dark ? (
        'Use Light Mode'
      ) : (
        'Use Dark Mode'
      )}
    </button>
  );
}

const NavigationList = React.memo(({ currentStoryModeId }) => (
  <ul className='grid py-1'>
    {NAVIGATION_ITEMS.map((navigationItemData) => (
      <NavigationItem
        key={navigationItemData.label}
        navigationItemData={navigationItemData}
        isSelected={navigationItemData.id === currentStoryModeId}
      />
    ))}
  </ul>
));

const NavigationItem = React.memo(({ 
  navigationItemData, 
  isSelected,
}) => {
  const router = useRouter();
  const dispatch = useNavigation();
  const routeHrefObject = { 
    query: { 
      ...router.query,
      [QUERY_KEY.STORY_LIST_MODE_ID]: navigationItemData.id 
    }
  }
  const handleClickCurrentSelected = () => dispatch({ type: NAVIGATION_ACTION.TOGGLE_PANEL });
  
  return (
    <li className='relative flex'>
      <Link 
        href={routeHrefObject} 
        shallow
      >
        <a 
          className={clsx(
            'flex-1 flex items-center border-1 border-transparent rounded pl-3 pr-2 py-3 leading-none select-none cursor-pointer',
            {'bg-knItemSelected': isSelected},
            {'before:absolute before:inset-0 before:right-auto before:rounded before:my-auto before:w-1 before:h-1/2 before:bg-knOrange before:pointer-events-none': isSelected},
          )}
          onClick={isSelected && handleClickCurrentSelected}
        >
          <div className='w-7 h-7 mr-4'>
            {navigationItemData.icon}
          </div>
          <span className='text-lg'>
            {navigationItemData.label}
          </span>
        </a>
      </Link>
    </li>
  );
});

export default NavigationPanel;