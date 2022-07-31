import React from "react";
import { useRouter } from "next/router";
import clsx from "clsx";

import NavigationPanel from "./NavigationPanel";
import StoryListPanel from "./StoryListPanel";
import StoryDiscussionPanel from "./StoryDiscussionPanel";

import { NavigationContext } from "../context/NavigationContext";

import { NAVIGATION_ACTION, QUERY_KEY, STORYDISCUSSION_ACTION } from "../utils/constants";
import { parseStoryListModeId } from "../utils/fetchApi";
import { StoryContext } from "../context/StoryContext";

//#region reducer
const navigationReducer = (state, action) => {
  switch (action.type) {
    case NAVIGATION_ACTION.SET_ID: 
      return {
        ...state,
        isExpanded: false,
        storyListModeId: (state.storyListModeId !== action.storyListModeId) 
          ? action.storyListModeId 
          : state.storyListModeId,
      };
    case NAVIGATION_ACTION.TOGGLE_PANEL:
      return {
        ...state,
        isExpanded: !state.isExpanded,
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
        id: (state.id !== action.id) ? action.id : state.id
      }
    case STORYDISCUSSION_ACTION.EXPAND_PANEL:
      return {
        ...state,
        isExpanded: true,
      };
    case STORYDISCUSSION_ACTION.RETRACT_PANEL:
      return {
        ...state,
        isExpanded: false,
      };
    case STORYDISCUSSION_ACTION.DISABLE_PERMALINK:
      if (state.isPermalink === true) {
        return {
          ...state,
          isExpanded: false,
          isPermalink: false,
        };
      } else {
        return state;
      }
    
    default:
      throw new Error();
  }
}
//#endregion

const AppDashboardPage = ({ initialStoryListModeId, initialStoryDiscussionId, initialIsPermalink, }) => {
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

  //#region navigation useeffect
  // set initial list mode id
  React.useEffect(() => {
    const storyListModeId = parseStoryListModeId(initialStoryListModeId);
    dispatchNavigation({
      type: NAVIGATION_ACTION.SET_ID,
      storyListModeId,
    });
    // default query string on load, if query string is empty
    router.replace({
      query: {
        ...router.query,
        [QUERY_KEY.STORY_LIST_MODE_ID]: storyListModeId,
      }
    }, undefined, { shallow: true });
  }, [initialStoryListModeId]);

  // set list mode id based on route query
  React.useEffect(() => {
    const { 
      [QUERY_KEY.STORY_LIST_MODE_ID]: storyModeId, 
    } = router.query;

    if (storyModeId && navigation.storyListModeId !== storyModeId) {
      dispatchNavigation({
        type: NAVIGATION_ACTION.SET_ID,
        storyListModeId: storyModeId,
      });
      console.log('effect')
    }
  }, [router.query, navigation.storyListModeId]);
  //#endregion

  // handle story comments panel expansion and set new stroycommentsid
  React.useEffect(() => {
    const { 
      [QUERY_KEY.STORY_DISCUSSION_ID]: newStoryDiscussionId, 
      [QUERY_KEY.IS_STORY_DISCUSSION_EXPANDED]: isStoryDiscussionExpanded,
    } = router.query;
    
    if (isStoryDiscussionExpanded) {
      if (newStoryDiscussionId && newStoryDiscussionId !== storyDiscussion.id) {
        dispatchStoryDiscussion({
          type: STORYDISCUSSION_ACTION.SET_ID,
          id: newStoryDiscussionId,
        });
      } else {
        dispatchStoryDiscussion({ type: STORYDISCUSSION_ACTION.EXPAND_PANEL });
      }
    } else {
      dispatchStoryDiscussion({ type: STORYDISCUSSION_ACTION.RETRACT_PANEL });
    }
  }, [router.query, storyDiscussion.id]);

  // handle story comments panel focused state
  React.useEffect(() => {
    if (storyDiscussion.isPermalink) {
      const { 
        [QUERY_KEY.IS_PERMALINK]: isPermalink,
        [QUERY_KEY.IS_STORY_DISCUSSION_EXPANDED]: _,
      } = router.query;
  
      if (isPermalink === undefined) {
        dispatchStoryDiscussion({ type: STORYDISCUSSION_ACTION.DISABLE_PERMALINK }); 
      }
    }
  }, [router.query, storyDiscussion.isPermalink]);

  return ( 
    <NavigationContext.Provider value={dispatchNavigation}>
      <StoryContext.Provider value={storyDiscussion.id}>
        <div className='bg-knBackground'>
          <div className={clsx(
            'relative grid mx-auto w-full h-screen max-w-screen-2xl',
            'md:grid-cols-[1fr_2fr]',
            'xl:grid-cols-[1fr_2.5fr]',
            '2xl:grid-cols-[1fr_3fr] 2xl:overflow-hidden'
          )}>
            {!storyDiscussion.isPermalink && (
              <>
                <NavigationPanel
                  isExpanded={navigation.isExpanded}
                  currentStoryModeId={navigation.storyListModeId}
                />
                <StoryListPanel 
                  storyListModeId={navigation.storyListModeId} 
                  onToggleNavigationPanel={null}
                />
              </>
            )}
            <StoryDiscussionPanel 
              isExpanded={storyDiscussion.isExpanded}
              isPermalink={storyDiscussion.isPermalink}
              storyDiscussionId={storyDiscussion.id} 
            />
          </div>
        </div>
      </StoryContext.Provider>
    </NavigationContext.Provider>
  );
}

export default AppDashboardPage;