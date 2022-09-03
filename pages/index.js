import Head from "next/head";
import clsx from "clsx";

import NavigationPanel from "../components/NavigationPanel";
import StoryDiscussionPanel from "../components/StoryDiscussionPanel";
import StoryListPanel from "../components/StoryListPanel";

import { NavigationProvider } from "../context/NavigationContext";
import { StoryDiscussionProvider } from "../context/StoryDiscussionContext";

import { QUERY_KEY } from "../utils/constants";

const HomePage = ({ initialStoryListModeId, initialStoryDiscussionId, initialIsPermalink }) => (
  <>
    <Head>
      <title>Kono News - A Fluent Hacker News Viewer</title>
      <meta name="description" content="Kono News is a heavily-opinionated Hacker News viewer with a splash of Microsoft's Fluent Design." />
      <meta property="og:title" content="Kono News - A Fluent Hacker News Viewer" />
      <meta property="og:description" content="Kono News is a heavily-opinionated Hacker News viewer with a splash of Microsoft's Fluent Design." />
      <meta property="og:url" content="https://news.kono.cx/" />
    </Head>

    <NavigationProvider initialStoryListModeId={initialStoryListModeId}>
      <StoryDiscussionProvider
        initialIsPermalink={initialIsPermalink}
        initialStoryDiscussionId={initialStoryDiscussionId}
      >
        <div className={clsx(
          'relative grid mx-auto w-full h-screen max-w-screen-2xl',
          'md:grid-cols-[1fr_2fr] md:gap-x-1.5',
          'xl:grid-cols-[1fr_2.5fr]',
          '2xl:grid-cols-[1fr_3fr] 2xl:gap-x-2 2xl:overflow-hidden 2xl:p-2'
        )}>
          <NavigationPanel />
          <StoryListPanel />
          <StoryDiscussionPanel />
        </div>
      </StoryDiscussionProvider>
    </NavigationProvider>
  </>
);

export const getServerSideProps = async ({ query }) => {
  const { 
    [QUERY_KEY.STORY_LIST_MODE_ID]: listMode, 
    [QUERY_KEY.STORY_DISCUSSION_ID]: storyDiscussionId,
    [QUERY_KEY.IS_PERMALINK]: isPermalink,
    [QUERY_KEY.IS_STORY_DISCUSSION_EXPANDED]: isExpanded,
  } = query;

  return {
    props: {
      queryString: query,
      initialStoryListModeId: listMode ?? null, 
      initialStoryDiscussionId: (!isExpanded && !isPermalink) ? null : storyDiscussionId ?? null,
      initialIsPermalink: isPermalink ?? null,
    }
  };
}

export default HomePage;