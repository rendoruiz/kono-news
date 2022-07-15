import StoryList from "../components/StoryList";
import { getInitialStoriesData, getListMode } from "../utils/hnStories";

const HomePage = ({ 
  initialStoryIdList, 
  initialStoryListData,
}) => {
  return (  
    <StoryList storyListData={initialStoryListData} />
  );
}

export const getServerSideProps = async ({ query }) => {
  const listMode = getListMode(query.mode);
  const [initialStoryIdList, initialStoryListData] = await getInitialStoriesData(listMode);

  return {
    props: {
      initialStoryIdList,
      initialStoryListData,
    }
  }
}

export default HomePage;