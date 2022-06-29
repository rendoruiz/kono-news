import TopicItem from "./TopicItem";

const TopicList = ({ topicListData }) => {
  return (
    <ol>
      {topicListData.map((topicItemData, index) => 
        <TopicItem 
          key={`${topicItemData.id}-${index}`}
          {...topicItemData} 
        />
      )}
    </ol>
  );
}
 
export default TopicList;