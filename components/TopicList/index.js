import TopicItem from "./TopicItem";

const TopicList = ({ topicListData }) => {
  return (
    <ol>
      {topicListData.map((topicItemData) => <TopicItem {...topicItemData} />)}
    </ol>
  );
}
 
export default TopicList;