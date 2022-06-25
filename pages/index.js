import TopicList from '../components/TopicList'

const Home = ({ data }) => {
  return (
    <div>
      <TopicList topicListData={data} />
    </div>
  )
}

export const getServerSideProps = async (context) => {
  const res = await fetch('https://api.hnpwa.com/v0/news/1.json');
  const data = await res.json();
  return {
    props: {
      data,
    }
  }
}

export default Home;