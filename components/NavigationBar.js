import { Portal } from "react-portal";

import { FluentLineHorizontal3Regular, FluentArrowTrendingRegular, FluentChatHelpRegular, FluentHomeRegular, FluentNotepadPersonRegular, FluentRocketRegular, FluentTrophyRegular } from "./shared/FluentIcons";

import { useStoryNavigation } from "../hooks/useStoryNavigation";

const STORY_TYPE = {
  TOP: 'top',
  NEW: 'new',
  BEST: 'best',
  ASK: 'ask',
  SHOW: 'show',
  JOB: 'job',
}

export const NAVIGATION_ITEMS = [
  {
    id: STORY_TYPE.TOP,
    apiQuery: 'topstories',
    name: 'Home',
    icon: <FluentHomeRegular />,
  },
  {
    id: STORY_TYPE.NEW,
    apiQuery: 'newstories',
    name: 'New',
    icon: <FluentArrowTrendingRegular />,
  },
  {
    id: STORY_TYPE.BEST,
    apiQuery: 'beststories',
    name: 'Best',
    icon: <FluentTrophyRegular />,
  },
  {
    id: STORY_TYPE.ASK,
    apiQuery: 'askstories',
    name: 'Ask',
    icon: <FluentChatHelpRegular />,
  },
  {
    id: STORY_TYPE.SHOW,
    apiQuery: 'showstories',
    name: 'Show',
    icon: <FluentRocketRegular />,
  },
  {
    id: STORY_TYPE.JOB,
    apiQuery: 'jobstories',
    name: 'Jobs',
    icon: <FluentNotepadPersonRegular />,
  },
];

export const NavigationBar = () => {
  const { listType } = useStoryNavigation();
  return (
    <>
      <div>
        <NavigationToggle />
        <p>{listType.name}</p>
      </div>
      <NavigationPanel />
    </>
  );
}

const NavigationPanel = () => {
  const { listType, isExpanded, toggleNavigation } = useStoryNavigation();
  
  return (
    <Portal>
      <>
        <NavigationSmokeOverlay
          isExpanded={isExpanded}
          toggleNavigation={toggleNavigation}
        />

        {isExpanded && (
          <div className="fixed top-0 left-0 w-full max-w-xs h-screen bg-black">
            <NavigationToggle />


          </div>
        )}
      </> 
    </Portal>
  )
}

const NavigationSmokeOverlay = ({ isExpanded, toggleNavigation }) => {
  return isExpanded && (
    <div 
      className="fixed inset-0 bg-FluentSmokeFillColorDefault"
      onClick={toggleNavigation} 
    /> 
  )
}

const NavigationToggle = () => {
  const { toggleNavigation } = useStoryNavigation();
  return (
    <button onClick={toggleNavigation}>
      <FluentLineHorizontal3Regular className="w-5 h-5" />
    </button>
  )
}