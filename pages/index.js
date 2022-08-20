import Head from "next/head";

import AppDashboardPage from "../components/AppDashboardPage";

import { QUERY_KEY } from "../utils/constants";

const HomePage = (props) => (
  <>
    <Head>
      <title>Kono News - A Fluent Hacker News Viewer</title>
      <meta name="description" content="Kono News is a heavily-opinionated Hacker News viewer with a splash of Microsoft's Fluent Design." />
      <meta property="og:title" content="Kono News - A Fluent Hacker News Viewer" />
      <meta property="og:description" content="Kono News is a heavily-opinionated Hacker News viewer with a splash of Microsoft's Fluent Design." />
      <meta property="og:url" content="https://news.kono.cx/" />
    </Head>
    <AppDashboardPage {...props} />
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