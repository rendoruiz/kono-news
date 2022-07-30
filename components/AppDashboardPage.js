import React from "react";
import { useRouter } from "next/router";
import clsx from "clsx";

import NavigationPanel from "./NavigationPanel";
import StoryListPanel from "./StoryListPanel";
import StoryCommentsPanel from "./StoryCommentsPanel";

import { NAVIGATION_ACTION, QUERY_KEY, STORYCOMMENTS_ACTION } from "../utils/constants";
import { parseStoryListModeId } from "../utils/fetchApi";

//#region reducer
const navigationReducer = (state, action) => {
  switch (action.type) {
    case NAVIGATION_ACTION.SET_ID: 
      return {
        ...state,
        isExpanded: !state.isExpanded,
        storyListModeId: (state.storyListModeId !== action.storyListModeId) 
          ? action.storyListModeId 
          : state.storyCommentsId,
      };
    case NAVIGATION_ACTION.EXPAND_PANEL: 
      return {
        ...state, 
        isExpanded: true,
      };
    case NAVIGATION_ACTION.RETRACT_PANEL: 
      return {
        ...state, 
        isExpanded: false,
      };
    default:
      throw new Error();
  }
}

const storyCommentsReducer = (state, action) => {
  switch (action.type) {
    case STORYCOMMENTS_ACTION.SET_ID:
      return {
        ...state,
        isExpanded: true,
        id: (state.id !== action.id) ? action.id : state.id
      }
    case STORYCOMMENTS_ACTION.EXPAND_PANEL:
      return {
        ...state,
        isExpanded: true,
      };
    case STORYCOMMENTS_ACTION.RETRACT_PANEL:
      return {
        ...state,
        isExpanded: false,
      };
    case STORYCOMMENTS_ACTION.DISABLE_FOCUS:
      if (state.isFocused === true) {
        return {
          ...state,
          isExpanded: false,
          isFocused: false,
        };
      } else {
        return state;
      }
    default:
      throw new Error();
  }
}
//#endregion

const AppDashboardPage = ({ queryString, initialStoryListModeId, initialStoryCommentsId, isStoryCommentsFocused, }) => {
  const router = useRouter(); 
  const [navigation, dispatchNavigation] = React.useReducer(
    navigationReducer, 
    {
      isExpanded: false,
      storyListModeId: initialStoryListModeId,
    }
  );
  const [storyComments, dispatchStoryComments] = React.useReducer(
    storyCommentsReducer,
    {
      isExpanded: isStoryCommentsFocused ? true : false,
      isFocused: isStoryCommentsFocused ? true : false,
      id: initialStoryCommentsId,
    }
  );

  // remove expansion flags on first mount
  React.useEffect(() => {
    const {
      [QUERY_KEY.IS_NAVIGATION_EXPANDED]: isNavigationExpanded,
      ...cleanedQuery
    } = router.query;
    if (isNavigationExpanded) {
      router.replace(
        { query: cleanedQuery},
        undefined, 
        { shallow: true }
      );
    }
  }, []);

  // handle navigation panel expansion and set new storylistid
  React.useEffect(() => {
    const { 
      [QUERY_KEY.STORY_MODE]: newStoryListModeId, 
      [QUERY_KEY.IS_NAVIGATION_EXPANDED]: isExpanded,
    } = router.query;

    if (!isExpanded) {
      if (newStoryListModeId && newStoryListModeId !== navigation.storyListModeId) {
        const parsedId = parseStoryListModeId(newStoryListModeId)
        dispatchNavigation({
          type: NAVIGATION_ACTION.SET_ID,
          storyListModeId: parsedId,
        })
      } else {
        dispatchNavigation({ type: NAVIGATION_ACTION.RETRACT_PANEL })
      }
    } else {
      dispatchNavigation({ type: NAVIGATION_ACTION.EXPAND_PANEL })
    }
  }, [router.query, navigation.storyListModeId, navigation.isExpanded]);

  // handle story comments panel expansion and set new stroycommentsid
  React.useEffect(() => {
    const { 
      [QUERY_KEY.STORY_COMMENTS_ID]: newStoryCommentsId, 
      [QUERY_KEY.IS_STORY_COMMENTS_EXPANDED]: isStoryCommentsExpanded,
    } = router.query;
    
    if (isStoryCommentsExpanded) {
      if (newStoryCommentsId && newStoryCommentsId !== storyComments.id) {
        dispatchStoryComments({
          type: STORYCOMMENTS_ACTION.SET_ID,
          id: newStoryCommentsId,
        });
      } else {
        dispatchStoryComments({ type: STORYCOMMENTS_ACTION.EXPAND_PANEL });
      }
    } else {
      dispatchStoryComments({ type: STORYCOMMENTS_ACTION.RETRACT_PANEL });
    }
  }, [router.query, storyComments.id]);

  // handle story comments panel focused state
  React.useEffect(() => {
    if (storyComments.isFocused) {
      const { 
        [QUERY_KEY.IS_STORY_COMMENTS_FOCUSED]: isStoryCommentsFocused,
        [QUERY_KEY.IS_STORY_COMMENTS_EXPANDED]: _,
      } = router.query;
  
      if (isStoryCommentsFocused === undefined) {
        dispatchStoryComments({ type: STORYCOMMENTS_ACTION.DISABLE_FOCUS }); 
      }
    }
  }, [router.query, storyComments.isFocused]);

  const handleToggleNavigationPanel = () => {
    const {
      [QUERY_KEY.IS_NAVIGATION_EXPANDED]: isExpanded,
      ...newRouterQuery
    } = router.query;
    if (navigation.isExpanded) {
      router.replace(
        { query: newRouterQuery}, 
        undefined, 
        { shallow: true }
      );
    } else {
      router.push(
        { query: {
          ...newRouterQuery,
          [QUERY_KEY.IS_NAVIGATION_EXPANDED]: true,
        }}, 
        undefined, 
        { shallow: true }
      );
    }
  };

  return ( 
    <div className='bg-brandBackground'>
      <div className={clsx(
        'relative grid mx-auto w-full h-screen max-w-screen-2xl',
        'md:grid-cols-[1fr,2fr]',
        'xl:grid-cols-[1fr,2.5fr]',
        '2xl:grid-cols-[1fr,3fr]'
      )}>
        {!storyComments.isFocused && (
          <>
            <NavigationPanel  
              isExpanded={navigation.isExpanded}
              initialSelectedItemId={initialStoryListModeId}
              onTogglePanel={handleToggleNavigationPanel}
            />
            <StoryListPanel 
              storyListModeId={navigation.storyListModeId} 
              onToggleNavigationPanel={handleToggleNavigationPanel}
            />
          </>
        )}
        <StoryCommentsPanel 
          isExpanded={storyComments.isExpanded}
          isFocused={storyComments.isFocused}
          storyCommentsId={storyComments.id} 
        />
      </div>
    </div>
  );
}

export default AppDashboardPage;