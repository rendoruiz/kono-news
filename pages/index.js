import StoryList from "../components/StoryList";
import { getInitialStoriesData } from "../utils/hnStories";

const BestStories = ({ 
  initialStoryIdList, 
  initialStoryListData 
}) => {
  return (  
    <StoryList storyListData={initialStoryListData} />
  );
}

export const getServerSideProps = async (context) => {
  const [initialStoryIdList, initialStoryListData] = await getInitialStoriesData('best');

  return {
    props: {
      initialStoryIdList,
      initialStoryListData,
    }
  }
}

export default BestStories;