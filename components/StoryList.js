import { useQuery } from "react-query";
import { useStoryList } from "../hooks/useStoryList";
import { useStoryNavigation } from "../hooks/useStoryNavigation";
import { HN_API_ENDPOINT, reactQueryParams } from "../utils/constants";
import { getInitialStoryListData } from "../utils/fetchApi";

export const StoryList = () => {
  const { listType } = useStoryNavigation();
  const { storyListIds, isPageLimitReached, isLoading, isError, refetch, loadMoreStories } = useStoryList(listType.apiQuery);

  if (isLoading || isError) { 
    return (
      <div>
        {isLoading && <p>Loading...</p>}
        {isError && (
          <>
            <p>Something went horribly wrong.</p>
            <button onClick={refetch}>Refresh</button>
          </>
        )}
      </div>
    );
  }

  return storyListIds && !isError && (
    <>
      <ul>
        {storyListIds.map((storyItem) => (
          <StoryItem
            key={storyItem.id}
            story={storyItem}
          />
        ))}
      </ul>
      {!isPageLimitReached && (
        <button onClick={loadMoreStories}>
          Load More Stories
        </button>
      )}
    </>
  );
}

const StoryItem = ({ story, isSelected }) => {
  return (
    <li>
      {story.id} {story?.title}
    </li>
  );
}