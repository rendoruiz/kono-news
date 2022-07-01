import StoryList from "../components/StoryList";
import { getInitialStoriesData } from "../utils/hnStories";

const JobStoriesPage = ({ 
  initialStoryIdList, 
  initialStoryListData 
}) => {
  return (  
    <StoryList storyListData={initialStoryListData} />
  );
}

export const getServerSideProps = async (context) => {
  const [initialStoryIdList, initialStoryListData] = await getInitialStoriesData('job');

  return {
    props: {
      initialStoryIdList,
      initialStoryListData,
    }
  }
}
 
export default JobStoriesPage;