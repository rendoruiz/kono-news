import Head from 'next/head';

import AppDashboardPage from "../components/AppDashboardPage";

import { parseStoryListModeId } from "../utils/fetchApi";
import { QUERY_KEY } from "../utils/constants";

const HomePage = (props) => (
  <>
    <Head>
      <title>Kono News - A Hacker News Viewer</title>
    </Head>
    <AppDashboardPage {...props} />
  </>
);

export const getServerSideProps = async ({ query }) => {
  const { 
    [QUERY_KEY.STORY_LIST_MODE_ID]: listMode, 
    [QUERY_KEY.STORY_DISCUSSION_ID]: storyDiscussionId,
    [QUERY_KEY.IS_PERMALINK]: isStoryDiscussionFocused,
  } = query;

  return {
    props: {
      queryString: query,
      initialStoryListModeId: parseStoryListModeId(listMode), 
      initialStoryDiscussionId: storyDiscussionId ?? null,
      isStoryDiscussionFocused: isStoryDiscussionFocused ?? null,
    }
  };
}

export default HomePage;