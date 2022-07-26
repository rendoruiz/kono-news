import React from 'react';
import { useRouter } from "next/router";
import clsx from "clsx";

import NavigationToggle from "../shared/NavigationToggle";

import { handleOnKeyDown } from "../../utils";
import { NAVIGATION_ITEMS, QUERY_KEY } from "../../utils/constants";

const NavigationPanel = ({ 
  isExpanded, 
  initialSelectedItemId, 
  onTogglePanel, 
}) => (
  <>
    <NavigationPanelOverlay 
      isExpanded={isExpanded}
      onClick={onTogglePanel}
    />
    <section className={clsx(
      'fixed z-modal inset-0 right-auto px-1 py-2 w-4/5 min-w-[120px] max-w-[300px] bg-brandBackground -translate-x-full transition-transform panel-transition overflow-y-auto pointer-events-none',
      {'translate-x-0 pointer-events-auto': isExpanded}
    )}>
      <NavigationToggle onClick={onTogglePanel} />
      <NavigationList initialSelectedItemId={initialSelectedItemId} />
    </section>
  </>
);

const NavigationPanelOverlay = ({ isExpanded, onClick }) => (
  <div 
    className={clsx(
      'fixed z-modal inset-0 bg-modalOverlay opacity-0 transition-opacity panel-transition pointer-events-none',
      {'opacity-100 pointer-events-auto': isExpanded},
    )}
    onClick={onClick}
    title='navigation panel toggleable overlay'
  />
);

const NavigationList = React.memo(({ initialSelectedItemId }) => (
  <ul className='grid py-1'>
    {NAVIGATION_ITEMS.map((navigationItemData) => (
      <NavigationItem
        key={navigationItemData.label}
        navigationItemData={navigationItemData}
        initialSelectedItem={navigationItemData.id === initialSelectedItemId ? true : undefined}
      />
    ))}
  </ul>
));

const NavigationItem = React.memo(({ 
  navigationItemData, 
  initialSelectedItem,
}) => {
  const router = useRouter();
  const controlId = 'nav-item-' + navigationItemData.id;

  const handleNavigationChange = () => {
    const { 
      [QUERY_KEY.IS_NAVIGATION_EXPANDED]: isNavOpen, 
      ...newRouterQuery
    } = router.query
    router.replace(
      { query: { 
        ...newRouterQuery,
        [QUERY_KEY.STORY_MODE]: navigationItemData.id, 
      }}, 
      undefined, 
      { shallow: true }
    );
  }
  
  return (
    <li className='relative flex'>
      <input 
        type='radio' 
        name='navigation-item' 
        id={controlId} 
        defaultChecked={initialSelectedItem}
        className='peer absolute opacity-0 pointer-events-none'
        onKeyDown={(e) => handleOnKeyDown(e, handleNavigationChange)} 
      />
      <label 
        htmlFor={controlId} 
        className={clsx(
          'flex-1 flex items-center border-1 border-transparent rounded pl-3 pr-2 py-3 leading-none select-none cursor-pointer',
          'peer-checked:bg-itemSelected',
          'peer-checked:before:absolute peer-checked:before:inset-0 peer-checked:before:right-auto peer-checked:before:rounded peer-checked:before:my-auto peer-checked:before:w-1 peer-checked:before:h-1/2 peer-checked:before:bg-brandOrange peer-checked:before:pointer-events-none'
        )}
        onClick={() => handleNavigationChange()}
      >
        <div className='w-7 h-7 mr-4'>
          {navigationItemData.icon}
        </div>
        <span className='text-title'>
          {navigationItemData.label}
        </span>
      </label>
    </li>
  );
});

export default NavigationPanel;