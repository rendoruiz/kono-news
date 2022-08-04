import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from "next/router";
import { useTheme } from 'next-themes';
import clsx from "clsx";

import NavigationToggle from "./shared/NavigationToggle";
import PillSelectedIndicator from './shared/PillSelectedIndicator';
import { FluentWeatherMoonRegular, FluentWeatherSunnyRegular } from './shared/FluentIcons';

import { useNavigation } from '../context/NavigationContext';

import { APP_THEME, NAVIGATION_ACTION, NAVIGATION_ITEMS, QUERY_KEY } from "../utils/constants";

const NavigationPanel = ({
  isExpanded, 
  currentStoryModeId,
}) => (
  <>
    <NavigationPanelOverlay isExpanded={isExpanded} />
    <section className={clsx(
      'fixed z-modal inset-0 right-auto flex flex-col pt-2 pb-1 w-4/5 min-w-[140px] max-w-[300px] bg-FluentLightSolidBackgroundFillColorBase text-FluentLightTextFillColorPrimary -translate-x-full transition-all ease-in-out overflow-y-auto pointer-events-none',
      'dark:bg-FluentDarkSolidBackgroundFillColorBase dark:text-FluentDarkTextFillColorPrimary',
      'md:px-1 md:w-full md:max-w-[280px]',
      '2xl:absolute 2xl:border-1.5 2xl:border-l-0 2xl:rounded-lg 2xl:rounded-l-none 2xl:opacity-0 2xl:-translate-x-1/4 2xl:transition-all 2xl:duration-200',
      {'translate-x-0 pointer-events-auto': isExpanded},
      {'2xl:opacity-100 2xl:translate-x-0': isExpanded},
    )}>
      <NavigationHeader />
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

const NavigationHeader = React.memo(() => (
  <header className={clsx(
    'px-5 py-2',
    'md:px-3 md:py-1'
  )}>
    <NavigationToggle />
  </header>
));

const NavigationFooter = React.memo(() => {
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
    <header className='grid mt-auto'>
      <button
        type='button'
        onClick={toggleTheme}
        className={clsx(
          'flex items-center px-5 py-3.5 text-left leading-none transition-colors hover:bg-FluentLightSubtleFillColorSecondary active:bg-FluentLightSubtleFillColorTertiary active:text-FluentLightTextFillColorTertiary',
          'dark:hover:bg-FluentDarkSubtleFillColorSecondary dark:active:bg-FluentDarkSubtleFillColorTertiary dark:active:text-FluentDarkTextFillColorTertiary',
          'md:border-1 md:border-transparent md:rounded md:px-3 md:py-2.5',
        )}
      >
        <div className={clsx(
          'w-6 h-6 mr-4',
          'md:w-5 md:h-5 md:mr-5'
        )}>
          {theme === APP_THEME.dark ? (
            <FluentWeatherSunnyRegular />
          ) : (
            <FluentWeatherMoonRegular />
          )}
        </div>
        <span className={clsx(
          'text-lg',
          'md:text-base'
        )}>
          Switch Lights&nbsp;
          {theme === APP_THEME.dark ? 'On' : 'Off'}
        </span>
      </button>
    </header>
  );
});

const NavigationList = React.memo(({ currentStoryModeId }) => (
  <ul className={clsx(
    'grid',
    'md:gap-y-1 md:py-0.5'
  )}>
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
            'relative flex-1 flex items-center px-5 py-3.5 leading-none transition-colors select-none cursor-pointer',
            'hover:bg-FluentLightSubtleFillColorSecondary active:bg-FluentLightSubtleFillColorTertiary active:text-FluentLightTextFillColorTertiary',
            'dark:hover:bg-FluentDarkSubtleFillColorSecondary dark:active:bg-FluentDarkSubtleFillColorTertiary dark:active:text-FluentDarkTextFillColorTertiary',
            'md:border-1 md:border-transparent md:rounded md:px-3 md:py-2.5',
            {'bg-FluentLightSubtleFillColorSecondary hover:bg-FluentLightSubtleFillColorTertiary': isSelected},
            {'dark:bg-FluentDarkSubtleFillColorSecondary dark:hover:bg-FluentDarkSubtleFillColorTertiary': isSelected},
          )}
          onClick={isSelected && handleClickCurrentSelected}
        >
          <PillSelectedIndicator isSelected={isSelected} />
          <div className={clsx(
            'w-6 h-6 mr-4',
            'md:w-5 md:h-5 md:mr-5'
          )}>
            {navigationItemData.icon}
          </div>
          <span className={clsx(
            'text-lg',
            'md:text-base'
          )}>
            {navigationItemData.label}
          </span>
        </a>
      </Link>
    </li>
  );
});

export default NavigationPanel;