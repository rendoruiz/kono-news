import StoryItem from "./StoryItem";

const StoryList = ({ storyListData }) => {
  return (
    <ol>
      {storyListData.map((storyItemData, index) => 
        <StoryItem 
          key={`${storyItemData.id}-${index}`}
          {...storyItemData} 
        />
      )}
    </ol>
  );
}
 
export default StoryList;