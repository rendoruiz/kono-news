import Head from 'next/head';

import AppDashboardPage from "../components/AppDashboardPage";

import { parseStoryListModeId } from "../utils/fetchApi";
import { QUERY_KEY } from "../utils/constants";

const HomePage = (props) => (
  <>
    <Head>
      <title>Kono News - A Hacker News Viewer</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
      <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500&family=Uchen&display=swap" rel="stylesheet" />
    </Head>
    <AppDashboardPage {...props} />
  </>
);

export const getServerSideProps = async ({ query }) => {
  const { 
    [QUERY_KEY.STORY_LIST_MODE_ID]: listMode, 
    [QUERY_KEY.STORY_DISCUSSION_ID]: storyDiscussionId,
    [QUERY_KEY.IS_PERMALINK]: isPermalink,
  } = query;

  return {
    props: {
      queryString: query,
      initialStoryListModeId: parseStoryListModeId(listMode), 
      initialStoryDiscussionId: storyDiscussionId ?? null,
      isPermalink: isPermalink ?? null,
    }
  };
}

export default HomePage;