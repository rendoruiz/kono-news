
import { useState } from "react";
import { useQuery } from 'react-query';
import styled from "@emotion/styled";

import { NAVIGATION_ITEMS, reactQueryParams, STORIES_PER_PAGE } from "../../../utils/constants";
import { getInitialStoryListData, getStoryData } from "../../../utils/fetchApi";

//#region styles
const StyledStoryListPanel = styled.section`
  overflow-y: auto;
`;
const StyledStoryListHeader = styled.div``;
const StyledStoryList = styled.ol`
  display: grid;
  gap: 2px;

  [data-loading],
  [data-loading] ~ [data-loading] {

  }
`;

const StyledStoryItem = styled.li`
  button {
    border: none;
    padding: 2px 8px;
    width: 100%;
    background: none;
    text-align: left;
    cursor: pointer;
  }

  &[data-loading] ~ [data-loader] {
    display: block !important;
  }

  &[data-loading] {
    display: none !important;
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


const StoryListPanel = ({ storyListModeId }) => {
  return (
    <StyledStoryListPanel>
      {/* header w/ nav toggle */}
      <StoryListHeader storyListModeId={storyListModeId} />

      {/* story list */}
      <StoryList storyListModeId={storyListModeId} />
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

const StoryList = ({ storyListModeId }) => {
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
  const storyListIds = isPageLimitReached 
    ? fetchedStoryIds 
    : fetchedStoryIds.slice(0, currentItemCount);
  
  return (
    <>
      <StyledStoryList>
        {storyListIds.map((storyItem) => (
          <StoryItem
            key={storyItem.id}
            storyItemData={storyItem}
          />
        ))}
        <StyledStoryItemLoader data-loader>
          Loading items...
        </StyledStoryItemLoader>
      </StyledStoryList>

      {/* story list propagation button */}
      {!isPageLimitReached && (
        <button 
          type='button'
          onClick={handlePageChange}
        >
          load more
        </button>
      )}
    </>
  );
}

const StoryItem = ({ storyItemData }) => {
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

  return (
    <StyledStoryItem>
      <button>
        <StyledStoryTitle>
          <StyledStoryHeading>{title}</StyledStoryHeading>
          <StoryItemUrl url={url} />
        </StyledStoryTitle>
        <StyledStoryStats>
          {points} points | {post_count} comments | {author} | {time}
        </StyledStoryStats>
      </button>
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