import StoryList from '../components/StoryList'

const Newest = ({ initialData }) => {
  return (
    <StoryList storyListData={initialData} />
  );
}

export const getServerSideProps = async (context) => {
  const res = await fetch('https://api.hnpwa.com/v0/newest.json');
  const initialData = await res.json();
  return {
    props: { initialData }
  }
}
 
export default Newest;