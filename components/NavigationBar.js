import Link from 'next/link';
import { useRouter } from 'next/router';
import { Portal } from "react-portal";

import { FluentLineHorizontal3Regular, FluentArrowTrendingRegular, FluentChatHelpRegular, FluentHomeRegular, FluentNotepadPersonRegular, FluentRocketRegular, FluentTrophyRegular } from "./shared/FluentIcons";

import { useStoryNavigation } from "../hooks/useStoryNavigation";

import { QUERY_KEY } from '../utils/constants';
import { getRoundTime } from '../utils/functions';

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
  const { listType, storyList: { lastUpdated, refetch } } = useStoryNavigation();
  const formattedLastUpdated = getRoundTime(lastUpdated, true)
  return (
    <>
      <div className="flex">
        <NavigationToggle />
        <p>{listType.name} | last updated {formattedLastUpdated}</p>&nbsp;
        <button type='button' onClick={refetch}>[refetch]</button>
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

            <ul>
              {NAVIGATION_ITEMS.map((navItem) =>      <NavigationItem  
                key={navItem.id}
                navItem={navItem}
                isSelected={navItem.id === listType.id}
              />
              )}
            </ul>
          </div>
        )}
      </> 
    </Portal>
  )
}

const NavigationItem = ({ navItem, isSelected }) => {
  const router = useRouter();
  const { setListType } = useStoryNavigation();
  const {
    [QUERY_KEY.IS_NAVIGATION_EXPANDED]: _,
    ...newQuery
  } = router.query;
  const hrefObject = { query: {
    ...newQuery,
    [QUERY_KEY.STORY_LIST_TYPE_ID]: navItem.id
  }}
  return (
    <li>
      <Link href={hrefObject} shallow replace>
        <a className='flex' onClick={() => setListType(navItem)}>
          <div className='w-5 h-5'>
            {navItem.icon}
          </div>
          {navItem.name}
          {isSelected && ' [S]'}
        </a>
      </Link>
    </li>
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