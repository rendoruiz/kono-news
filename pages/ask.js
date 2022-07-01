import StoryList from '../components/StoryList'

const Ask = ({ initialData }) => {
  return (
    <StoryList storyListData={initialData} />
  );
}

export const getServerSideProps = async (context) => {
  const res = await fetch('https://api.hnpwa.com/v0/ask/1.json');
  const initialData = await res.json();
  return {
    props: { initialData }
  }
}
 
export default Ask;