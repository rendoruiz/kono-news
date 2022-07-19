import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { NAVIGATION_ITEMS, QUERY_KEY } from "../../utils/constants";

//#region styles
const StyledNavigationPanel = styled.section`

`;
const StyledNavigationList = styled.ul`
  display: grid;
`;
const StyledNavigationItem = styled.li`
  display: flex;
  position: relative;

  label {
    flex: 1;
    padding: 10px 3px;
    cursor: pointer;
  }

  input[type="radio"] {
    position: absolute;
    visibility: hidden;
    opacity: 0;
    pointer-events: none;
  }

  input[type="radio"]:checked + label {
    background: rgba(0,0,0,0.25);
  }
`;
//#endregion

const NavigationPanel = ({ isExpanded, initialSelectedItemId, onTogglePanel, }) => {
  return (
    <StyledNavigationPanel>
      <NavigationList initialSelectedItemId={initialSelectedItemId} />
    </StyledNavigationPanel>
  );
}

const NavigationList = ({ initialSelectedItemId }) => {return (
    <StyledNavigationList>
      {NAVIGATION_ITEMS.map((navigationItemData) => (
        <NavigationItem
          key={navigationItemData.label}
          navigationItemData={navigationItemData}
          initialSelectedItem={navigationItemData.id === initialSelectedItemId ? true : undefined}
        />
      ))}
    </StyledNavigationList>
  )
}

const NavigationItem = ({ navigationItemData, initialSelectedItem }) => {
  const router = useRouter();
  const controlId = 'nav-item-' + navigationItemData.id;

  const handleNavigationChange = () => {
    router.push(
      { query: { 
        ...router.query,
        [QUERY_KEY.STORY_MODE]: navigationItemData.id, 
      }}, 
      undefined, 
      { shallow: true }
    );
  }
  const handleKeyPress = (e) => {
    const keyCode = e.code.toUpperCase();
    if (keyCode === "ENTER" || keyCode === "SPACE") {
      handleNavigationChange();
    }
  }
  
  return (
    <StyledNavigationItem>
      <input 
        type="radio" 
        name='navigation-item' 
        id={controlId} 
        onKeyDown={handleKeyPress} 
        defaultChecked={initialSelectedItem}
      />
      <label 
        for={controlId} 
        onClick={() => handleNavigationChange()}
      >
        {navigationItemData.label}
      </label>
    </StyledNavigationItem>
  )
}

export default NavigationPanel;