
import { useState } from "react";
import { useQuery } from 'react-query';
import styled from "@emotion/styled";

import { NAVIGATION_ITEMS, reactQueryParams, STORIES_PER_PAGE } from "../../utils/constants";
import { getInitialStoryListData, getStoryData } from "../../utils/fetchApi";

//#region styles
const StyledStoryListPanel = styled.section`
  overflow-y: auto;
`;
const StyledStoryListHeader = styled.header``;
const StyledStoryListContent = styled.main``;
const StyledStoryList = styled.ol`
  display: grid;
  gap: 2px;

  [data-loading],
  [data-loading] ~ [data-loading] {

  }
`;
const StyledStoryItem = styled.li`
  display: flex;
  position: relative;

  label {
    flex: 1;
    border: none;
    padding: 2px 8px;
    width: 100%;
    text-align: left;
    cursor: pointer;
  }

  &[data-loading] ~ [data-loader] {
    display: block !important;
  }

  &[data-loading] {
    display: none !important;
  }

  input[type="radio"] {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }
  input[type="radio"]:checked + label {
    background: rgba(0,0,0,0.25);
  }
`;
const StyledStoryItemLoader = styled.li`
  display: none;
`
const StyledStoryTitle = styled.div`
  /* display: inline; */
`
const StyledStoryHeading = styled.h3`
  display: inline;
  font-size: 1.1em;
`;
const StyledStoryUrl = styled.span`
  font-size: 0.75em;
  opacity: 0.6;
  
  ::before {
    content: '  ';
  }
`;
const StyledStoryStats = styled.p`
  font-size: 0.75em;
  opacity: 0.6;
`;
//#endregion


const StoryListPanel = ({ storyListModeId, onStoryItemClick, onToggleNavigationPanel, onToggleStoryCommentsPanel }) => {
  return (
    <StyledStoryListPanel>
      {/* header w/ nav toggle */}
      <StoryListHeader storyListModeId={storyListModeId} />

      {/* story list */}
      <StoryListContent storyListModeId={storyListModeId} onStoryItemClick={onStoryItemClick} />
    </StyledStoryListPanel>
  );
}

const StoryListHeader = ({ storyListModeId }) => {
  const listModeName = NAVIGATION_ITEMS.filter((mode) => mode.id === storyListModeId).pop().label
  return (
    <StyledStoryListHeader>
      {listModeName}
    </StyledStoryListHeader>
  );
}

const StoryListContent = ({ storyListModeId, onStoryItemClick }) => {
  const { isLoading, isError, data: fetchedStoryIds, error } = useQuery(
    ['storylist', storyListModeId], 
    () => getInitialStoryListData(storyListModeId, true),
    reactQueryParams
  );
  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = () => setCurrentPage(currentPage + 1);

  if (isLoading) {
    return (
      <StyledStoryList data-loading>
        <p>Loading List IDs...</p>
      </StyledStoryList>
    );
  }

  if (isError) {
    return (
      <StyledStoryList data-error>
        <p>Loading List IDs error: {error}</p>
      </StyledStoryList>
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
    <StyledStoryListContent>
      <StoryList
        storyListData={storyListData}
        onStoryItemClick={onStoryItemClick}
      />
      {/* story list propagation button */}
      {!isPageLimitReached && (
        <button 
          type='button'
          onClick={handlePageChange}
        >
          load more
        </button>
      )}
    </StyledStoryListContent>
  );
}

const StoryList = ({ storyListData, onStoryItemClick }) => {
  return (
    <StyledStoryList>
      {storyListData.map((storyItemData) => (
        <StoryItem
          key={storyItemData.id}
          storyItemData={storyItemData}
          onStoryItemClick={onStoryItemClick}
        />
      ))}
      <StyledStoryItemLoader data-loader>
        Loading items...
      </StyledStoryItemLoader>
    </StyledStoryList>
  )
}

const StoryItem = ({ storyItemData, onStoryItemClick }) => {
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
      <StyledStoryItem data-loading />
    );
  }

  if (isError) {
    return (
      <StyledStoryItem data-error>
        <p>Loading Story #{storyItemData} error: {error}</p>
      </StyledStoryItem>
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

  const handleKeyPress = (e) => {
    const keyCode = e.code.toUpperCase();
    if (keyCode === "ENTER" || keyCode === "SPACE") {
      onStoryItemClick(id);
    }
  }

  const controlId = `story-item-${id}`;

  return (
    <StyledStoryItem>
      <input type='radio' name='story-item' id={controlId} onKeyDown={handleKeyPress}  />
      <label htmlFor={controlId} onClick={() => onStoryItemClick(id)}>
        <StyledStoryTitle>
          <StyledStoryHeading>{title}</StyledStoryHeading>
          <StoryItemUrl url={url} />
        </StyledStoryTitle>
        <StyledStoryStats>
          {points} points | {post_count} comments | {author} | {time}
        </StyledStoryStats>
      </label>
    </StyledStoryItem>
  );
}

const getUrlHostname = (url) => !url ? null : new URL(url).hostname.split('www.').join('');

const StoryItemUrl = ({url}) => {
  if (!url) {
    return null;
  }

  const urlHostname = getUrlHostname(url);
  return (
    <StyledStoryUrl>
      ({urlHostname})
    </StyledStoryUrl>
  )
}

export default StoryListPanel;