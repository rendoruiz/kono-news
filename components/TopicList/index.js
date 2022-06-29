import TopicItem from "./TopicItem";

const TopicList = ({ topicListData }) => {
  return (
    <ol>
      {topicListData.map((topicItemData, index) => 
        <TopicItem 
          key={`${topicItemData}-${index}`}
          {...topicItemData} 
        />
      )}
    </ol>
  );
}
 
export default TopicList;