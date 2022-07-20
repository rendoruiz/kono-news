import { useEffect, useReducer } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";

import NavigationPanel from "../components/NavigationPanel";
import StoryListPanel from "../components/StoryListPanel";
import StoryCommentsPanel from "../components/StoryCommentsPanel";

import { parseStoryListModeId } from "../utils/fetchApi";
import { NAVIGATION_ACTION, QUERY_KEY, STORYCOMMENTS_ACTION } from "../utils/constants";
import { viewport } from "../styles/styledConstants";
import { StoryCommentsContext } from "../contexts/storyComments";

//#region styles
const StyledAppContainer = styled.div`
  background-color: rgb(246, 246, 239);
`;
const StyledAppLayout = styled.div`
  position: relative;
  display: grid;
  margin: 0 auto;
  width: 100%;
  max-width: 1536px;
  height: 100vh;

  ${viewport.lg} {
    grid-template-columns: auto 1fr 2fr;
  }
`;
//#endregion

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

const AppDashboard = ({ queryString, initialStoryListModeId, initialStoryCommentsId, isStoryCommentsFocused, }) => {
  const router = useRouter(); 
  const [navigation, dispatchNavigation] = useReducer(
    navigationReducer, 
    {
      isExpanded: false,
      storyListModeId: initialStoryListModeId,
    }
  );
  const [storyComments, dispatchStoryComments] = useReducer(
    storyCommentsReducer,
    {
      isExpanded: false,
      isFocused: isStoryCommentsFocused ? true : false,
      id: initialStoryCommentsId,
    }
  );

  useEffect(() => {
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
  }, [router.query, navigation.storyListModeId, navigation.isExpanded])

  useEffect(() => {
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
  }, [router.query, storyComments.id])

  useEffect(() => {
    const { 
      [QUERY_KEY.IS_STORY_COMMENTS_FOCUSED]: isStoryCommentsFocused,
    } = router.query;

    if (isStoryCommentsFocused === undefined && storyComments.isFocused) {
      dispatchStoryComments({
        type: STORYCOMMENTS_ACTION.DISABLE_FOCUS,
      }); 
      console.log('useeffect focused')
    }
  }, [router.query, storyComments.isFocused])

  const handleToggleNavigationPanel = () => {
    console.log('isexpanded: ' + navigation.isExpanded)
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
    <StyledAppContainer>
      <StyledAppLayout>
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
      </StyledAppLayout>
    </StyledAppContainer>
  );
}

export const getServerSideProps = async ({ query }) => {
  const { 
    [QUERY_KEY.STORY_MODE]: listMode, 
    [QUERY_KEY.STORY_COMMENTS_ID]: storyCommentsId,
    [QUERY_KEY.IS_STORY_COMMENTS_FOCUSED]: isStoryCommentsFocused,
  } = query;

  return {
    props: {
      queryString: query,
      initialStoryListModeId: parseStoryListModeId(listMode), 
      initialStoryCommentsId: storyCommentsId ?? null,
      isStoryCommentsFocused: isStoryCommentsFocused ?? null,
    }
  };
}

export default AppDashboard;