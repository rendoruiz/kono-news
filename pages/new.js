import StoryList from "../components/StoryList";
import { getInitialStoriesData } from "../utils/hnStories";

const NewStoriesPage = ({ 
  initialStoryIdList, 
  initialStoryListData 
}) => {
  return (  
    <StoryList storyListData={initialStoryListData} />
  );
}

export const getServerSideProps = async (context) => {
  const [initialStoryIdList, initialStoryListData] = await getInitialStoriesData('new');

  return {
    props: {
      initialStoryIdList,
      initialStoryListData,
    }
  }
}
 
export default NewStoriesPage;