import axios from "axios";
import StoryList from "../components/StoryList";

const BestStories = ({ initialData }) => {
  return (  
    <StoryList storyListData={initialData} />
  );
}

export const getServerSideProps = async (context) => {
  const endpoint = 'https://hacker-news.firebaseio.com/v0/';

  const response = await axios.get(endpoint + 'topstories.json');
  const storyIdList = response.data;

  const initialStoryListData = await Promise.all(
    storyIdList.slice(0, 30).map((storyId) =>
      axios.get(endpoint + `item/${storyId}.json`).then((response) => response.data)
    )
  );

  return {
    props: {
      initialData: initialStoryListData,
      storyIdList,
    }
  }
}
 
export default BestStories;