import { createContext, useEffect, useReducer } from 'react';
import { useRouter } from "next/router";

import { QUERY_KEY, STORYDISCUSSION_ACTION } from '../utils/constants';

export const StoryDiscussionContext = createContext(null);

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

export const StoryDiscussionProvider = ({ children, initialIsPermalink, initialStoryDiscussionId }) => {
  const router = useRouter();
  const [storyDiscussion, dispatchStoryDiscussion] = useReducer(storyDiscussionReducer, {
    isExpanded: initialIsPermalink ? true : false,
    isPermalink: initialIsPermalink ? true : false,
    id: initialStoryDiscussionId,
  });

  // panel expansion + new story discussion id
  useEffect(() => {
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

  // if permalink on mount
  useEffect(() => {
    if (storyDiscussion.isPermalink) {
      const { 
        [QUERY_KEY.IS_PERMALINK]: isPermalink,
      } = router.query;
  
      if (isPermalink === undefined) {
        dispatchStoryDiscussion({ type: STORYDISCUSSION_ACTION.DISABLE_PERMALINK }); 
      }
    }
  }, [router.query, storyDiscussion.isPermalink]);

  return (
    <StoryDiscussionContext.Provider value={{...storyDiscussion}}>
      {children}
    </StoryDiscussionContext.Provider>
  );
}