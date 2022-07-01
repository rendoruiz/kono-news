import StoryList from "../components/StoryList";
import { getInitialStoriesData } from "../utils/hnStories";

const AskStoriesPage = ({ 
  initialStoryIdList, 
  initialStoryListData 
}) => {
  return (  
    <StoryList storyListData={initialStoryListData} />
  );
}

export const getServerSideProps = async (context) => {
  const [initialStoryIdList, initialStoryListData] = await getInitialStoriesData('ask');

  return {
    props: {
      initialStoryIdList,
      initialStoryListData,
    }
  }
}
 
export default AskStoriesPage;