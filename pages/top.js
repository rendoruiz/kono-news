import StoryList from "../components/StoryList";
import { getInitialStoriesData } from "../utils/hnStories";

const TopStoriesPage = ({ 
  initialStoryIdList, 
  initialStoryListData 
}) => {
  return (  
    <StoryList storyListData={initialStoryListData} />
  );
}

export const getServerSideProps = async (context) => {
  const [initialStoryIdList, initialStoryListData] = await getInitialStoriesData('top');

  return {
    props: {
      initialStoryIdList,
      initialStoryListData,
    }
  }
}
 
export default TopStoriesPage;