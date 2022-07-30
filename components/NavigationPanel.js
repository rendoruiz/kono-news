import React from 'react';
import Link from 'next/link';
import { useRouter } from "next/router";
import clsx from "clsx";

import NavigationToggle from "./shared/NavigationToggle";

import { NAVIGATION_ACTION, NAVIGATION_ITEMS, QUERY_KEY } from "../utils/constants";
import { useNavigation } from '../context/NavigationContext';

const NavigationPanel = ({
  isExpanded, 
  currentStoryModeId,
}) => (
  <>
    <NavigationPanelOverlay isExpanded={isExpanded} />
    <section className={clsx(
      'fixed z-modal inset-0 right-auto px-1 py-2 w-4/5 min-w-[120px] max-w-[300px] bg-brandBackground -translate-x-full transition-transform panel-transition overflow-y-auto pointer-events-none',
      {'translate-x-0 pointer-events-auto': isExpanded}
    )}>
      <NavigationToggle />
      <NavigationList currentStoryModeId={currentStoryModeId} />
    </section>
  </>
);

const NavigationPanelOverlay = ({ isExpanded }) => {
  const dispatch = useNavigation();
  const handleClick = () => dispatch({ type: NAVIGATION_ACTION.TOGGLE_PANEL });

  return (
    <div 
      className={clsx(
        'fixed z-modal inset-0 bg-modalOverlay opacity-0 transition-opacity panel-transition pointer-events-none',
        {'opacity-100 pointer-events-auto': isExpanded},
      )}
      onClick={handleClick}
      title='navigation panel toggleable overlay'
    />
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
  const routeHrefObject = { 
    query: { [QUERY_KEY.STORY_MODE]: navigationItemData.id }
  }
  
  return (
    <li className='relative flex'>
      <Link 
        href={routeHrefObject} 
        shallow
      >
        <a className={clsx(
          'flex-1 flex items-center border-1 border-transparent rounded pl-3 pr-2 py-3 leading-none select-none cursor-pointer',
          {'bg-itemSelected': isSelected},
          {'before:absolute before:inset-0 before:right-auto before:rounded before:my-auto before:w-1 before:h-1/2 before:bg-brandOrange before:pointer-events-none': isSelected},
        )}>
          <div className='w-7 h-7 mr-4'>
            {navigationItemData.icon}
          </div>
          <span className='text-title'>
            {navigationItemData.label}
        </span>
        </a>
      </Link>
    </li>
  );
});

export default NavigationPanel;