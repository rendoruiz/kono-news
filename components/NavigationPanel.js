import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from "next/router";
import clsx from "clsx";

import NavigationToggle from "./shared/NavigationToggle";

import { useNavigation } from '../context/NavigationContext';

import { APP_THEME, LOCALSTORAGE_KEY, NAVIGATION_ACTION, NAVIGATION_ITEMS, QUERY_KEY } from "../utils/constants";
import useLocalStorageState from 'use-local-storage-state';
import { useTheme } from 'next-themes';

const NavigationPanel = ({
  isExpanded, 
  currentStoryModeId,
}) => (
  <>
    <NavigationPanelOverlay isExpanded={isExpanded} />
    <section className={clsx(
      'fixed z-modal inset-0 right-auto py-2 w-4/5 min-w-[140px] max-w-[300px] min-h-screen bg-FluentLightSolidBackgroundFillColorBase text-FluentLightTextFillColorPrimary -translate-x-full transition-all ease-in-out overflow-y-auto pointer-events-none',
      'dark:bg-FluentDarkSolidBackgroundFillColorBase dark:text-FluentDarkTextFillColorPrimary',
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
        'fixed z-modal inset-0 bg-FluentSmokeFillColorDefault opacity-0 transition-opacity pointer-events-none',
        {'opacity-100 pointer-events-auto': isExpanded},
      )}
      onClick={handleClick}
      title='navigation panel toggleable overlay'
    />
  );
}

const NavigationFooter = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const currentTheme = theme.replaceAll('\"', '');
    if (currentTheme === APP_THEME.dark) {
      setTheme(APP_THEME.light)
    } else if (currentTheme === APP_THEME.light) {
      setTheme(APP_THEME.dark)
    }
  }

  React.useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      type='button'
      onClick={toggleTheme}
      className='mt-auto'
    >
      [{theme}]
      {theme === APP_THEME.dark ? (
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