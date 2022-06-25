import TopicList from '../components/TopicList'

const Newest = ({ initialData }) => {
  return (
    <TopicList topicListData={initialData} />
  );
}

export const getServerSideProps = async (context) => {
  const res = await fetch('https://api.hnpwa.com/v0/news/1.json');
  const initialData = await res.json();
  return {
    props: { initialData }
  }
}
 
export default Newest;