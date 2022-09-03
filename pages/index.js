import Head from "next/head";

import { QUERY_KEY } from "../utils/constants";
import { StoryNavigationProvider } from "../context/StoryNavigationContext";
import { StoryList } from "../components/StoryList";
import { NavigationBar } from "../components/NavigationBar";

const HomePage = ({ initialListTypeId, initialStoryDiscussionId, initialIsPermalink }) => (
  <>
    <Head>
      <title>Kono News - A Fluent Hacker News Viewer</title>
      <meta name="description" content="Kono News is a heavily-opinionated Hacker News viewer with a splash of Microsoft's Fluent Design." />
      <meta property="og:title" content="Kono News - A Fluent Hacker News Viewer" />
      <meta property="og:description" content="Kono News is a heavily-opinionated Hacker News viewer with a splash of Microsoft's Fluent Design." />
      <meta property="og:url" content="https://news.kono.cx/" />
    </Head>

    <StoryNavigationProvider initialListTypeId={initialListTypeId}>
      <section>
        <NavigationBar />
        <StoryList />
      </section>
    </StoryNavigationProvider>
  </>
);

export const getServerSideProps = async ({ query }) => {
  const { 
    [QUERY_KEY.STORY_LIST_TYPE_ID]: listTypeId, 
    [QUERY_KEY.STORY_DISCUSSION_ID]: storyDiscussionId,
    [QUERY_KEY.IS_PERMALINK]: isPermalink,
    [QUERY_KEY.IS_STORY_DISCUSSION_EXPANDED]: isExpanded,
  } = query;

  return {
    props: {
      queryString: query,
      initialListTypeId: listTypeId ?? null, 
      initialStoryDiscussionId: (!isExpanded && !isPermalink) ? null : storyDiscussionId ?? null,
      initialIsPermalink: isPermalink ?? null,
    }
  };
}

export default HomePage;