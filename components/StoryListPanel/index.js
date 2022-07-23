import { useState } from "react";
import { useQuery } from 'react-query';
import { useRouter } from "next/router";

import NavigationToggle from "../shared/NavigationToggle";

import { QUERY_KEY, reactQueryParams, STORIES_PER_PAGE } from "../../utils/constants";
import { getInitialStoryListData, getStoryData } from "../../utils/fetchApi";
import { getNavigationItemByStoryListId, getShortTime, handleOnKeyDown } from "../../utils";
import * as Styled from "./styles";

const StoryListPanel = ({ storyListModeId, onToggleNavigationPanel }) => (
  <Styled.StoryListPanel>
    <StoryListHeader 
      storyListModeId={storyListModeId} 
      onToggleNavigationPanel={onToggleNavigationPanel} 
    />
    <StoryListContent storyListModeId={storyListModeId} />
  </Styled.StoryListPanel>
);

const StoryListHeader = ({ storyListModeId, onToggleNavigationPanel }) => {
  const listModeName = getNavigationItemByStoryListId(storyListModeId)?.label
  return (
    <Styled.StoryListHeader>
      <NavigationToggle onClick={onToggleNavigationPanel} />
      <h2>{listModeName}</h2>
    </Styled.StoryListHeader>
  );
}

const StoryListContent = ({ storyListModeId }) => {
  const { isLoading, isError, data: fetchedStoryIds, error } = useQuery(
    ['storylist', storyListModeId], 
    () => getInitialStoryListData(storyListModeId, true),
    reactQueryParams
  );
  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = () => setCurrentPage(currentPage + 1);

  if (isLoading) {
    return (
      <Styled.StoryList data-list-loading>
        {[...Array(8)].map((_, index) => (
          <Styled.StoryItem key={index} data-loading />
        ))}
      </Styled.StoryList>
    );
  }
  if (isError) {
    return (
      <Styled.StoryList data-list-error>
        <h3>Cannot fetch Story IDs.</h3>
        <p>{error?.message}</p>
      </Styled.StoryList>
    );
  }

  if (fetchedStoryIds) {
    const currentItemCount = STORIES_PER_PAGE * currentPage;
    const isPageLimitReached = currentItemCount >= fetchedStoryIds.length
      ? true 
      : false;
    const storyListData = isPageLimitReached 
      ? fetchedStoryIds 
      : fetchedStoryIds.slice(0, currentItemCount);
    
    return (
      <Styled.StoryListContent>
        <StoryList storyListData={storyListData} />
        {/* story list propagation button */}
        {!isPageLimitReached && (
          <button 
            type='button'
            onClick={handlePageChange}
          >
            Load More
          </button>
        )}
      </Styled.StoryListContent>
    );
  }
}

const StoryList = ({ storyListData }) => {
  return (
    <Styled.StoryList>
      {storyListData.map((storyItemData) => (
        <StoryItem
          key={storyItemData.id}
          storyItemData={storyItemData}
        />
      ))}
    </Styled.StoryList>
  )
}

const StoryItem = ({ storyItemData }) => {
  const router = useRouter();
  const { isLoading, isError, data: storyData, error } = useQuery(
    ['storydata', storyItemData.id], 
    () => getStoryData(storyItemData.id),
    { 
      initialData: storyItemData.isDataEmpty ? undefined : storyItemData, 
      ...reactQueryParams
    }
  );

  if (isLoading) {
    return (
      <Styled.StoryItem data-loading />
    );
  }
  if (isError || !storyData) {
    return (
      <Styled.StoryItem data-error>
        <p>Loading Story #{storyItemData} error: {error.message}</p>
      </Styled.StoryItem>
    )
  }

  const {
    id,
    title,
    url,
    by: author,
    score: points,
    time,
    descendants: post_count,
  } = storyData;
  const controlId = 'story-item-' + id;
  const shortTime = getShortTime(time);

  const handleStoryCommentsChange = () => {
    router.push(
      { query: { 
        ...router.query,
        [QUERY_KEY.STORY_COMMENTS_ID]: id, 
        [QUERY_KEY.IS_STORY_COMMENTS_EXPANDED]: true,
      }}, 
      undefined, 
      { shallow: true }
    );
  }

  return (
    <Styled.StoryItem>
      <input 
        type='radio' 
        name='story-item' 
        id={controlId} 
        onKeyDown={(e) => handleOnKeyDown(e, handleStoryCommentsChange)} 
      />
      <label 
        htmlFor={controlId} 
        onClick={() => handleStoryCommentsChange()}
      >
        <Styled.StoryItemHeading>
          {title}
        </Styled.StoryItemHeading>
        <Styled.StoryItemStats>
          <p>{points} points • {post_count} comments • {author}</p>
          <span>{shortTime}</span> 
        </Styled.StoryItemStats>
      </label>
    </Styled.StoryItem>
  );
}

export default StoryListPanel;