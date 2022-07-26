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
    <div className={clsx(
      'fixed z-modal inset-0 right-auto p-4 w-4/5 min-w-[120px] max-w-[300px] bg-brandBackground -translate-x-full transition-transform panel-transition overflow-y-auto pointer-events-none',
      {'translate-x-0 pointer-events-auto': isExpanded}
    )}>
      <NavigationToggle onClick={onTogglePanel} />
      <NavigationList initialSelectedItemId={initialSelectedItemId} />
    </div>
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
)

const NavigationList = ({ initialSelectedItemId }) => (
  <ul className='grid py-1'>
    {NAVIGATION_ITEMS.map((navigationItemData) => (
      <NavigationItem
        key={navigationItemData.label}
        navigationItemData={navigationItemData}
        initialSelectedItem={navigationItemData.id === initialSelectedItemId ? true : undefined}
      />
    ))}
  </ul>
);

const NavigationItem = ({ 
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
        className='absolute opacity-0 pointer-events-none'
        onKeyDown={(e) => handleOnKeyDown(e, handleNavigationChange)} 
      />
      <label 
        htmlFor={controlId} 
        className='
          flex-1 flex items-center rounded px-[3px] py-[5px] leading-none select-none cursor-pointer 
          peer-checked:bg-itemSelected
          peer-checked:before:absolute peer-checked:before:inset-0 peer-checked:before:right-auto peer-checked:before:rounded peer-checked:before:my-auto peer-checked:before:w-1 peer-checked:before:h-1/2 peer-checked:before:to-brandOrange peer-checked:before:pointer-events-none 
        '
        onClick={() => handleNavigationChange()}
      >
        <div className='w-5 h-5 mr-1'>
          {navigationItemData.icon}
        </div>
        <span>{navigationItemData.label}</span>
      </label>
    </li>
  );
}

export default NavigationPanel;