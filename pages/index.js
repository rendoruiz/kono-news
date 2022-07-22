import AppDashboardPage from "../components/AppDashboardPage";

import { parseStoryListModeId } from "../utils/fetchApi";
import { QUERY_KEY } from "../utils/constants";

const HomePage = (props) => (
  <AppDashboardPage {...props} />
);

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

export default HomePage;