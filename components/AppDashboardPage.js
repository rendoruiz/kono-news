import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import clsx from "clsx";

import NavigationPanel from "./NavigationPanel";
import StoryListPanel from "./StoryListPanel";
import StoryDiscussionPanel from "./StoryDiscussionPanel";

import { NavigationProvider } from "../context/NavigationContext";
import { StoryContext } from "../context/StoryContext";

import { QUERY_KEY, STORYDISCUSSION_ACTION } from "../utils/constants";

//#region reducer
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
  const router = useRouter();
  const [storyDiscussion, dispatchStoryDiscussion] = React.useReducer(
    storyDiscussionReducer,
    {
      isExpanded: initialIsPermalink ? true : false,
      isPermalink: initialIsPermalink ? true : false,
      id: initialStoryDiscussionId,
    }
  );

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

  return ( 
    <NavigationProvider initialStoryListModeId={initialStoryListModeId}>
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
              <NavigationPanel />
              <StoryListPanel />
            </>
          )}
          <StoryDiscussionPanel 
            isExpanded={storyDiscussion.isExpanded}
            isPermalink={storyDiscussion.isPermalink}
            storyDiscussionId={storyDiscussion.id} 
          />
        </div>
      </StoryContext.Provider>
    </NavigationProvider>
  );
}

export default AppDashboardPage;