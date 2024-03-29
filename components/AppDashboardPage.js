import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import clsx from "clsx";

import NavigationPanel from "./NavigationPanel";
import StoryListPanel from "./StoryListPanel";
import StoryDiscussionPanel from "./StoryDiscussionPanel";

import { NavigationContext } from "../context/NavigationContext";
import { StoryContext } from "../context/StoryContext";

import { NAVIGATION_ACTION, QUERY_KEY, STORYDISCUSSION_ACTION } from "../utils/constants";
import { parseStoryListModeId } from "../utils/fetchApi";

//#region reducer
const navigationReducer = (state, action) => {
  switch (action.type) {
    case NAVIGATION_ACTION.SET_ID: 
      return {
        ...state,
        storyListModeId: (state.storyListModeId !== action.storyListModeId) 
          ? action.storyListModeId 
          : state.storyListModeId,
        isExpanded: false,
      };
    case NAVIGATION_ACTION.EXPAND_PANEL:
      return {
        ...state,
        isExpanded: true,
      }
    case NAVIGATION_ACTION.RETRACT_PANEL:
      return {
        ...state,
        isExpanded: false,
      }
    default:
      throw new Error();
  }
}

const storyDiscussionReducer = (state, action) => {
  switch (action.type) {
    case STORYDISCUSSION_ACTION.SET_ID:
      return {
        ...state,
        isExpanded: true,
        id: (state.id !== action.id) 
          ? action.id 
          : state.id
      }
    case STORYDISCUSSION_ACTION.RETRACT_PANEL:
      return {
        ...state,
        isExpanded: false,
      }
    case STORYDISCUSSION_ACTION.DISABLE_PERMALINK:
      return {
        ...state,
        isExpanded: true,
        isPermalink: false,
      };
    default:
      throw new Error();
  }
}
//#endregion

const AppDashboardPage = ({ initialStoryListModeId, initialStoryDiscussionId, initialIsPermalink, }) => {
  const [isMounted, setIsMounted] = React.useState(false);
  const router = useRouter(); 
  const [navigation, dispatchNavigation] = React.useReducer(
    navigationReducer, 
    {
      isExpanded: false,
      storyListModeId: null,
    }
  );
  const [storyDiscussion, dispatchStoryDiscussion] = React.useReducer(
    storyDiscussionReducer,
    {
      isExpanded: initialIsPermalink ? true : false,
      isPermalink: initialIsPermalink ? true : false,
      id: initialStoryDiscussionId,
    }
  );
  
  //#region oncomponentmount useeffect
  // set initial list mode id & remove navigation expansion on mount
  React.useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
      
      const storyListModeId = parseStoryListModeId(initialStoryListModeId);
      dispatchNavigation({
        type: NAVIGATION_ACTION.SET_ID,
        storyListModeId,
      });
      // default query string on load, if query string is empty
      const { 
        [QUERY_KEY.IS_NAVIGATION_EXPANDED]: _,
        ...newRouterQuery
      } = router.query
      router.replace({
        query: {
          ...newRouterQuery,
          [QUERY_KEY.STORY_LIST_MODE_ID]: storyListModeId,
        }
      }, undefined, { shallow: true });
    }
  }, [initialStoryListModeId, isMounted, router]);
  //#endregion

  //#region navigation useeffect
  // set list mode id based on route query
  React.useEffect(() => {
    const { 
      [QUERY_KEY.STORY_LIST_MODE_ID]: newStoryModeId, 
    } = router.query;

    if (newStoryModeId && navigation.storyListModeId !== newStoryModeId) {
      dispatchNavigation({
        type: NAVIGATION_ACTION.SET_ID,
        storyListModeId: newStoryModeId,
      });
    }
  }, [router.query, navigation.storyListModeId]);

  // handle navigation panel expansion
  React.useEffect(() => {
    const { 
      [QUERY_KEY.IS_NAVIGATION_EXPANDED]: newIsExpanded,
    } = router.query;

    if (navigation.isExpanded && !newIsExpanded) {
      dispatchNavigation({ type: NAVIGATION_ACTION.RETRACT_PANEL });
    } else if (!navigation.isExpanded && newIsExpanded) {
      dispatchNavigation({ type: NAVIGATION_ACTION.EXPAND_PANEL });
    }
  }, [router.query, navigation.isExpanded]);
  //#endregion

  //#region story discussion useeffect
  // handle story comments panel expansion and set new stroycommentsid
  React.useEffect(() => {
    const { 
      [QUERY_KEY.STORY_DISCUSSION_ID]: newStoryDiscussionId, 
      [QUERY_KEY.IS_STORY_DISCUSSION_EXPANDED]: isStoryDiscussionExpanded,
    } = router.query;
    
    if (newStoryDiscussionId && isStoryDiscussionExpanded) {
      dispatchStoryDiscussion({
        type: STORYDISCUSSION_ACTION.SET_ID,
        id: newStoryDiscussionId,
      });
    } else if (!isStoryDiscussionExpanded) {
      dispatchStoryDiscussion({ type: STORYDISCUSSION_ACTION.RETRACT_PANEL });
    }
  }, [router.query, storyDiscussion.id]);
  //#endregion

  //#region story discussion is permalink useeffect
  // handle story comments panel focused state
  React.useEffect(() => {
    if (storyDiscussion.isPermalink) {
      const { 
        [QUERY_KEY.IS_PERMALINK]: isPermalink,
      } = router.query;
  
      if (isPermalink === undefined) {
        dispatchStoryDiscussion({ type: STORYDISCUSSION_ACTION.DISABLE_PERMALINK }); 
      }
    }
  }, [router.query, storyDiscussion.isPermalink]);
  //#endregion

  const handleToggleNavigationPanel = () => {
    if (!navigation.isExpanded) {
      router.push(
        { query: {
          ...router.query,
          [QUERY_KEY.IS_NAVIGATION_EXPANDED]: true,
        }}, 
        undefined, 
        { shallow: true }
      );
    } else {
      const {
        [QUERY_KEY.STORY_LIST_MODE_ID]: newStoryListModeId,
        [QUERY_KEY.STORY_DISCUSSION_ID]: newStoryDiscussionId,
        [QUERY_KEY.IS_STORY_DISCUSSION_EXPANDED]: newIsExpanded,
      } = router.query;
      // prevent clogging history from navigation toggle button spam clicking
      if (
        (newStoryDiscussionId === undefined || (navigation.storyListModeId == newStoryListModeId)) 
        && (newStoryDiscussionId === undefined || (storyDiscussion.id == newStoryDiscussionId)) 
        && (newIsExpanded === undefined || (storyDiscussion.isExpanded && newIsExpanded))
      ) {
        router.back(2);
      } else {
        const {
          [QUERY_KEY.IS_NAVIGATION_EXPANDED]: _,
          ...newRouterQuery
        } = router.query;
        router.replace(
          { query: newRouterQuery}, 
          undefined, 
          { shallow: true }
        );
      }
    }
  }

  return ( 
    <NavigationContext.Provider value={handleToggleNavigationPanel}>
      <StoryContext.Provider value={storyDiscussion.id}>
        <Head>
          <title>Kono News - A Fluent Hacker News Viewer</title>
          <meta name="description" content="Kono News is a heavily-opinionated Hacker News viewer with a splash of Microsoft's Fluent Design." />
          <meta property="og:title" content="Kono News - A Fluent Hacker News Viewer" />
          <meta property="og:description" content="Kono News is a heavily-opinionated Hacker News viewer with a splash of Microsoft's Fluent Design." />
          <meta property="og:url" content="https://news.kono.cx/" />
        </Head>

        <div className={clsx(
          'relative grid mx-auto w-full h-screen max-w-screen-2xl',
          'md:grid-cols-[1fr_2fr] md:gap-x-1.5',
          'xl:grid-cols-[1fr_2.5fr]',
          '2xl:grid-cols-[1fr_3fr] 2xl:gap-x-2 2xl:overflow-hidden 2xl:p-2'
        )}>
          {!storyDiscussion.isPermalink && (
            <>
              <NavigationPanel
                isExpanded={navigation.isExpanded}
                currentStoryModeId={navigation.storyListModeId}
              />
              <StoryListPanel 
                storyListModeId={navigation.storyListModeId} 
              />
            </>
          )}
          <StoryDiscussionPanel 
            isExpanded={storyDiscussion.isExpanded}
            isPermalink={storyDiscussion.isPermalink}
            storyDiscussionId={storyDiscussion.id} 
          />
        </div>
      </StoryContext.Provider>
    </NavigationContext.Provider>
  );
}

export default AppDashboardPage;