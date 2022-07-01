import StoryList from "../components/StoryList";
import { getInitialStoriesData } from "../utils/hnStories";

const ShowStoriesPage = ({ 
  initialStoryIdList, 
  initialStoryListData 
}) => {
  return (  
    <StoryList storyListData={initialStoryListData} />
  );
}

export const getServerSideProps = async (context) => {
  const [initialStoryIdList, initialStoryListData] = await getInitialStoriesData('show');

  return {
    props: {
      initialStoryIdList,
      initialStoryListData,
    }
  }
}
 
export default ShowStoriesPage;