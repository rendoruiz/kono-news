import Link from "next/link";
import { useState } from "react";
import { ListMode } from "../../utils/hnStories";
import StoryList from "../StoryList";

import * as Styled from './styles';

const StoryLayout = ({ storyListData }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const handleToggleNav = () => setIsNavOpen(!isNavOpen);

  return (  
    <Styled.StoryLayout>
      <NavigationSidebar
        isOpen={isNavOpen}
        onToggle={handleToggleNav}
      />

      <StoryContent
        storyListData={storyListData}
        isNavOpen={isNavOpen}
        onToggleNav={handleToggleNav}
      />
    </Styled.StoryLayout>
  );
}

const NavigationSidebar = ({ isOpen, onToggle, }) => (
  <>
    <Styled.NavigationSidebarOverlay 
      isOpen={isOpen} 
      onClick={onToggle} 
    />

    <Styled.NavigationSidebar isOpen={isOpen}>
      <NavigationToggle
        isOpen={isOpen}
        onToggle={onToggle}
      />
      <NavigationList onClick={onToggle} />
    </Styled.NavigationSidebar>
  </>
);

const NavigationToggle = ({ isOpen, onToggle }) => (
  <Styled.NavigationToggle
    type='button'
    onClick={onToggle}
    $isOpen={isOpen}
  >
    toggle
  </Styled.NavigationToggle>
);

const NavigationList = ({ onClick }) => (
  <Styled.NavigationList>
    {Object.keys(ListMode).map((mode) => (
      <NavigationItem 
        key={mode} 
        route={{ query: `mode=${mode.toLowerCase()}` }}
        onClick={onClick}
      >
        {ListMode[mode].label}
      </NavigationItem>
    ))}
  </Styled.NavigationList>
);

const NavigationItem = ({ route, children, ...props }) => (
  <li>
    <Link href={route}>
      <a {...props}>{children}</a>
    </Link>
  </li>
);

const StoryContent = ({ storyListData, isNavOpen, onToggleNav, }) => (
  <Styled.StoryContent>
    <NavigationToggle
      isOpen={isNavOpen}
      onToggle={onToggleNav}
    />
    <StoryList storyListData={storyListData} />
  </Styled.StoryContent>
);

export default StoryLayout;