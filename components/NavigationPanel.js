import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from "next/router";
import { useTheme } from 'next-themes';
import clsx from "clsx";
import { Github } from '@icons-pack/react-simple-icons';

import NavigationToggle from "./shared/NavigationToggle";
import PillSelectedIndicator from './shared/PillSelectedIndicator';
import ExternalLink from './shared/ExternalLink';
import { FluentWeatherMoonRegular, FluentWeatherSunnyRegular } from './shared/FluentIcons';

import { useNavigation } from '../context/NavigationContext';

import { APP_THEME, NAVIGATION_ITEMS, QUERY_KEY } from "../utils/constants";

const NavigationPanel = ({
  isExpanded, 
  currentStoryModeId,
}) => (
  <>
    <NavigationPanelOverlay isExpanded={isExpanded} />
    <section className={clsx(
      'fixed z-modal inset-0 right-auto flex flex-col pt-2 pb-1 w-4/5 min-w-[140px] max-w-[300px] bg-FluentLightSolidBackgroundFillColorQuarternary -translate-x-full transition-transform ease-in-out overflow-y-auto pointer-events-none',
      'dark:bg-FluentDarkSolidBackgroundFillColorQuarternary',
      'md:border-1 md:rounded-r-lg md:border-FluentLightSurfaceStrokeColorDefault md:border-l-transparent md:px-1 md:w-full md:max-w-[280px] md:shadow md:transition-transformOpacity',
      'dark:md:border-FluentDarkSurfaceStrokeColorDefault',
      '2xl:absolute 2xl:inset-2 2xl:rounded-lg 2xl:opacity-0 2xl:-translate-x-1/4',
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
  const handleClick = useNavigation();

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
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    const currentTheme = resolvedTheme.replaceAll('\"', '');
    if (currentTheme === APP_THEME.dark) {
      setTheme(APP_THEME.light);
    } else if (currentTheme === APP_THEME.light) {
      setTheme(APP_THEME.dark);
    }
  }

  React.useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <footer className='grid content-start mt-auto'>
      <ExternalLink
        href='https://github.com/rendoruiz/kono-list'
        className={clsx(
          'flex items-center px-5 py-3.5 text-left leading-none select-none',
          'hover:bg-FluentLightSubtleFillColorSecondary active:bg-FluentLightSubtleFillColorTertiary active:text-FluentLightTextFillColorTertiary',
          'dark:hover:bg-FluentDarkSubtleFillColorSecondary dark:active:bg-FluentDarkSubtleFillColorTertiary dark:active:text-FluentDarkTextFillColorTertiary',
          'md:border-1 md:border-transparent md:rounded md:px-3 md:py-2.5',
        )}
      >
        <Github className={clsx(
          'p-[1px] w-6 h-6 mr-4',
          'md:w-5 md:h-5 md:mr-5'
        )} />
        <span className={clsx(
          'text-lg',
          'md:text-base'
        )}>
          Fork at GitHub
        </span>
      </ExternalLink>
      
      <NavigationListDivider />

      <button
        type='button'
        onClick={toggleTheme}
        className={clsx(
          'flex items-center px-5 py-3.5 text-left leading-none select-none',
          'hover:bg-FluentLightSubtleFillColorSecondary active:bg-FluentLightSubtleFillColorTertiary active:text-FluentLightTextFillColorTertiary',
          'dark:hover:bg-FluentDarkSubtleFillColorSecondary dark:active:bg-FluentDarkSubtleFillColorTertiary dark:active:text-FluentDarkTextFillColorTertiary',
          'md:border-1 md:border-transparent md:rounded md:px-3 md:py-2.5',
        )}
      >
        <div className={clsx(
          'w-6 h-6 mr-4',
          'md:w-5 md:h-5 md:mr-5'
        )}>
          {resolvedTheme === APP_THEME.dark ? (
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
          {resolvedTheme === APP_THEME.dark ? 'On' : 'Off'}
        </span>
      </button>
    </footer>
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
  const handleClickCurrentSelected = useNavigation();
  const { 
    [QUERY_KEY.IS_NAVIGATION_EXPANDED]: _,
    ...newRouterQuery 
  } = router.query;
  const routeHrefObject = { 
    query: { 
      ...newRouterQuery,
      [QUERY_KEY.STORY_LIST_MODE_ID]: navigationItemData.id 
    }
  }
  
  return (
    <li className='relative flex'>
      <Link 
        href={routeHrefObject} 
        shallow
        replace
      >
        <a 
          className={clsx(
            'relative flex-1 flex items-center px-5 py-3.5 leading-none select-none cursor-pointer',
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

const NavigationListDivider = React.memo(() => (
  <div className={clsx(
    'w-full h-[1px] bg-FluentLightDividerStrokeColorDefault',
    'dark:bg-FluentDarkDividerStrokeColorDefault',
    'md:my-1'
  )} />
));

export default NavigationPanel;