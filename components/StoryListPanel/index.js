
import { useState } from "react";
import { useQuery } from 'react-query';
import { useRouter } from "next/router";

import { QUERY_KEY, reactQueryParams, STORIES_PER_PAGE } from "../../utils/constants";
import { getInitialStoryListData, getStoryData } from "../../utils/fetchApi";
import { getNavigationItemByStoryListId, getUrlHostname, handleOnKeyDown } from "../../utils";
import * as Styled from "./styles";

const StoryListPanel = ({ storyListModeId, onToggleNavigationPanel }) => {
  return (
    <Styled.StoryListPanel>
      {/* header w/ nav toggle */}
      <StoryListHeader 
        storyListModeId={storyListModeId} 
        onToggleNavigationPanel={onToggleNavigationPanel} 
      />

      {/* story list */}
      <StoryListContent storyListModeId={storyListModeId} />
    </Styled.StoryListPanel>
  );
}

const StoryListHeader = ({ storyListModeId, onToggleNavigationPanel }) => {
  const listModeName = getNavigationItemByStoryListId(storyListModeId)?.label
  return (
    <Styled.StoryListHeader>
      <button
        type='button'
        onClick={onToggleNavigationPanel}
      >
        toggle nav
      </button>
      {listModeName}
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
      <Styled.StoryList data-loading>
        <p>Loading List IDs...</p>
      </Styled.StoryList>
    );
  }

  if (isError) {
    return (
      <Styled.StoryList data-error>
        <p>Loading List IDs error: {error.message}</p>
      </Styled.StoryList>
    );
  }
  
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
          load more
        </button>
      )}
    </Styled.StoryListContent>
  );
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
      <Styled.StoryItemLoader data-loader>
        Loading items...
      </Styled.StoryItemLoader>
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
        <Styled.StoryTitle>
          <Styled.StoryHeading>{title}</Styled.StoryHeading>
          <StoryItemUrl url={url} />
        </Styled.StoryTitle>
        <Styled.StoryStats>
          {points} points | {post_count} comments | {author} | {time}
        </Styled.StoryStats>
      </label>
    </Styled.StoryItem>
  );
}

const StoryItemUrl = ({url}) => {
  if (!url) {
    return null;
  }

  const urlHostname = getUrlHostname(url);
  return (
    <Styled.StoryUrl>
      ({urlHostname})
    </Styled.StoryUrl>
  )
}

export default StoryListPanel;