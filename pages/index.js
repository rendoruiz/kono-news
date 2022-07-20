import { useEffect, useReducer } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";

import NavigationPanel from "../components/NavigationPanel";
import StoryListPanel from "../components/StoryListPanel";
import StoryCommentsPanel from "../components/StoryCommentsPanel";

import { StoryCommentsContext } from "../contexts/storyComments";

import { parseStoryListModeId } from "../utils/fetchApi";
import { NAVIGATION_ACTION, QUERY_KEY, STORYCOMMENTS_ACTION } from "../utils/constants";
import { viewport } from "../styles/styledConstants";

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

  ${viewport.md} {
    grid-template-columns: auto 1fr 2fr;
  }
`;
//#endregion

//#region reducer
const navigationReducer = (state, action) => {
  switch (action.type) {
    case NAVIGATION_ACTION.SET_ID: 
      if (state.storyListModeId !== action.storyListModeId) {
        return {
          ...state,
          isExpanded: false,
          storyListModeId: action.storyListModeId,
        };
      } else {
        return state;
      }
    case NAVIGATION_ACTION.TOGGLE_EXPANSION: 
      return {
        ...state, 
        isExpanded: !state.isExpanded,
      };
    default:
      throw new Error();
  }
}

const storyCommentsReducer = (state, action) => {
  switch (action.type) {
    case STORYCOMMENTS_ACTION.SET_ID:
      if (state.id !== action.id) {
        return {
          ...state,
          isExpanded: true,
          id: action.id,
        };
      } else {
        return state;
      }
    case STORYCOMMENTS_ACTION.TOGGLE_EXPANSION:
      return {
        ...state,
        isExpanded: !state.isExpanded,
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
      [QUERY_KEY.STORY_COMMENTS_ID]: newStoryCommentsId, 
      [QUERY_KEY.IS_STORY_COMMENTS_FOCUSED]: isStoryCommentsFocused,
    } = router.query;

    if (newStoryListModeId && newStoryListModeId != navigation.storyListModeId) {
      const parsedId = parseStoryListModeId(newStoryListModeId)
      dispatchNavigation({
        type: NAVIGATION_ACTION.SET_ID,
        storyListModeId: parsedId,
      })
    }
    if (newStoryCommentsId && newStoryCommentsId != storyComments.id) {
      dispatchStoryComments({
        type: STORYCOMMENTS_ACTION.SET_ID,
        id: newStoryCommentsId,
      });
    }
    if (isStoryCommentsFocused === undefined && storyComments.isFocused) {
      dispatchStoryComments({
        type: STORYCOMMENTS_ACTION.DISABLE_FOCUS,
      });
    }
    // console.log(router.query)
  }, [router.query]);

  const handleToggleNavigationPanel = () => dispatchNavigation({ type: NAVIGATION_ACTION.TOGGLE_EXPANSION });
  const handleToggleStoryCommentsPanel = () => dispatchStoryComments({ type: STORYCOMMENTS_ACTION.TOGGLE_EXPANSION });

  return (  
    <StoryCommentsContext.Provider value={null}>
      <StyledAppContainer>
        <StyledAppLayout>
          <NavigationPanel  
            isExpanded={navigation.isExpanded}
            initialSelectedItemId={initialStoryListModeId}
            onTogglePanel={handleToggleNavigationPanel}
          />

          <StoryListPanel 
            storyListModeId={navigation.storyListModeId} 
            onToggleNavigationPanel={handleToggleNavigationPanel}
          />

          <StoryCommentsPanel 
            isExpanded={storyComments.isExpanded}
            isFocused={storyComments.isFocused}
            storyCommentsId={storyComments.id} 
            onTogglePanel={handleToggleStoryCommentsPanel}
          />
        </StyledAppLayout>
      </StyledAppContainer>
    </StoryCommentsContext.Provider>
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