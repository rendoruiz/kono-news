import AppDashboardPage from "../components/AppDashboardPage";

import { QUERY_KEY } from "../utils/constants";

const HomePage = (props) => (
  <AppDashboardPage {...props} />
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