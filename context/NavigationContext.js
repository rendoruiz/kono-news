import { createContext, useEffect, useReducer, useState } from 'react';
import { useRouter } from "next/router";

import { NAVIGATION_ACTION, QUERY_KEY } from '../utils/constants';
import { parseStoryListModeId } from '../utils/fetchApi';

export const NavigationContext = createContext(null);

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

export const NavigationProvider = ({ children, initialStoryListModeId, discussionId, isDiscussionExpanded }) => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const [navigation, dispatchNavigation] = useReducer(navigationReducer, {

  });

  // set initial story list mode
  useEffect(() => {
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
  }, [initialStoryListModeId,, isMounted, router]);

  // navigation panel expansion toggle
  useEffect(() => {
    const { 
      [QUERY_KEY.IS_NAVIGATION_EXPANDED]: newIsExpanded,
    } = router.query;

    if (navigation.isExpanded && !newIsExpanded) {
      dispatchNavigation({ type: NAVIGATION_ACTION.RETRACT_PANEL });
    } else if (!navigation.isExpanded && newIsExpanded) {
      dispatchNavigation({ type: NAVIGATION_ACTION.EXPAND_PANEL });
    }
  }, [router.query, navigation.isExpanded]);

  // set new list mode id
  useEffect(() => {
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

  const toggleNavigation = () => {
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
        [QUERY_KEY.IS_STORY_DISCUSSION_EXPANDED]: newIsDiscussionExpanded,
      } = router.query;
      // prevent clogging history from navigation toggle button spam clicking
      if (
        (newStoryDiscussionId === undefined || (navigation.storyListModeId == newStoryListModeId)) 
        && (newStoryDiscussionId === undefined || (discussionId == newStoryDiscussionId)) 
        && (newIsDiscussionExpanded === undefined || (isDiscussionExpanded && newIsDiscussionExpanded))
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
    <NavigationContext.Provider value={{...navigation, toggleNavigation}}>
      {children}
    </NavigationContext.Provider>
  )
}