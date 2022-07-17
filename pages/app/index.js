import { useState } from "react";
import { useQuery } from 'react-query';
import styled from "@emotion/styled";

import { reactQueryParams, STORYMODE } from "../../utils/constants";
import { getStoryCommentData, getStoryData, getStoryListIds } from "../../utils/fetchData";

//#region AppDashboard
const StyledAppLayout = styled.div`
  min-width: 300px;
  min-height: 400px;
  width: 100vw;
  height: 100vh;
  
  background-color: rgb(246, 246, 239);
`;
const AppDashboard = ({ query, initialStoryListIds, initialStoryCommentsData, storyListPage, }) => {
  const storyCommentsData = initialStoryCommentsData;

  console.log({query, initialStoryListIds, initialStoryCommentsData, storyListPage});

  return (  
    <StyledAppLayout>
      {/* Navigation Panel */}
      {/* 
        Component States:
        selectedStoryListMode
        isExpanded, toggleNPExpansion
      */}
      <NavigationPanel />

      {/* Story List Panel */}
      {/* 
        Component States:
        selectedStoryItemData
      */}
      {/* 
        Shared Component States:
        selectedStoryListMode
        toggleNPExpansion, toggleSCPExpansion 
      */}
      <StoryListPanel 
        storyListMode={null} 
        initialStoryListIds={initialStoryListIds} 
      />

      {/* Story Comments Panel */}
      {/* 
        Component States:
        isExpanded, toggleSCPExpansion
      */}
      {/* 
        Shared Component States:
        selectedStoryItemData 
      */}
      <StoryCommentsPanel {...storyCommentsData} />
    </StyledAppLayout>
  );
}


export const getServerSideProps = async ({ query }) => {
  const { 
    mode: listMode, 
    page: listPage, 
    scid: storyCommentId 
  } = query;
  const storyListIds = await getStoryListIds(listMode);
  const storyCommentsData = await getStoryCommentData(storyCommentId);

  return {
    props: {
      query,
      initialStoryListIds: storyListIds,
      initialStoryCommentsData: storyCommentsData,
      storyListPage: listPage ?? null,
    }
  }
}

export default AppDashboard;
//#endregion


//#region Navigation Panel
const StyledNavigationPanel = styled.section``;

const NavigationPanel = ({}) => {
  return (
    <StyledNavigationPanel>

    </StyledNavigationPanel>
  );
}
//#endregion


//#region story list
const StyledStoryListPanel = styled.section``;
const StyledStoryListHeader = styled.div``;
const StyledStoryList = styled.ol`
  display: grid;
  gap: 2px;
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
`;
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

const STORIES_PER_PAGE = 30;

const StoryListPanel = ({ 
  storyListMode = STORYMODE.TOP.label, 
  initialStoryListIds, 
}) => {
  const { isLoading, isError, data: fetchedStoryIds, error } = useQuery(
    ['storylistids', storyListMode], 
    () => getStoryListIds(storyListMode),
    { initialData: initialStoryListIds, ...reactQueryParams }
  );
  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = () => setCurrentPage(currentPage + 1);

  if (isLoading) {
    return <p>Loading List IDs...</p>
  }

  if (isError) {
    return <p>Loading List IDs error: {error}</p>
  }

  if (!fetchedStoryIds) {
    return null;
  }
  
  const currentItemCount = STORIES_PER_PAGE * currentPage;
  const isPageLimitReached = currentItemCount >= fetchedStoryIds.length
    ? true 
    : false;
  const storyListIds = isPageLimitReached 
    ? fetchedStoryIds 
    : fetchedStoryIds.slice(0, currentItemCount);

    console.log(storyListIds)
  
  return (
    <StyledStoryListPanel>
      {/* header w/ nav toggle */}
      <StoryListHeader listMode={storyListMode} />

      {/* story list */}
      <StoryList storyListIds={storyListIds} />

      {/* story list propagation button */}
      {!isPageLimitReached && (
        <button 
          type='button'
          onClick={handlePageChange}
        >
          load more
        </button>
      )}
    </StyledStoryListPanel>
  );
}

const StoryListHeader = ({ listMode }) => {   // deconstruct props
  return (
    <StyledStoryListHeader>

    </StyledStoryListHeader>
  );
}

const StoryList = ({ storyListIds }) => {

  return (
    <StyledStoryList>
      {storyListIds.map((storyItemId) => (
        <StoryItem
          key={storyItemId}
          storyItemId={storyItemId}
        />
      ))}
    </StyledStoryList>
  );
}


const StoryItem = ({ storyItemId }) => {
  if (!storyItemId) {
    return null;
  } 

  const { isLoading, isError, data: storyData, error } = useQuery(
    ['storydata', storyItemId], 
    () => getStoryData(storyItemId),
    reactQueryParams
  );

  if (isLoading) {
    return <p>Loading Story #{storyItemId}</p>
  }

  if (isError) {
    return <p>Loading Story #{storyItemId} error: {error}</p>
  }

  if (!storyData) {
    return null;
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

  // const decodedTitle = decodeHTML(title);
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

const StoryItemUrl = ({url}) => {
  if (!url) {
    return null;
  }

  const urlHostname = !url ? null : new URL(url).hostname.split('www.').join('');
  return (
    <StyledStoryUrl>
      ({urlHostname})
    </StyledStoryUrl>
  )
}
//#endregion


//#region storycomments
const StyledStoryCommentsPanel = styled.section``;
const StyledStoryCommentsHeader = styled.div``;
const StyledStoryCommentsList = styled.ol``;
const StyledStoryCommentsItem = styled.li``;
const StoryCommentsPanel = ({ 
  id,
  title,
  url,
  author,
  points,
  post_count,
  children,
}) => {
  return (
    <StyledStoryCommentsPanel>
      {/* header with: back button (close story), full screen, story urls */}
      <StoryCommentsHeader 
        id={id} 
        title={title} 
        url={url} 
        author={author}
      />

      {/* story comments list */}
      <StoryCommentsList storyCommentData={children} />
    </StyledStoryCommentsPanel>
  );
}

const StoryCommentsHeader = ({ 
  id, 
  title, 
  url, 
  author, 
}) => {
  return (
    <StyledStoryCommentsHeader>

    </StyledStoryCommentsHeader>
  )
}

const StoryCommentsList = ({ storyCommentListData }) => {
  if (!storyCommentListData) {
    return null;
  }

  return (
    <StyledStoryCommentsList>
      {storyCommentListData.map((storyCommentItemData) =>
        <StoryCommentItem
          key={storyCommentItemData.id}
          {...storyCommentItemData}
        />
      )}
    </StyledStoryCommentsList>
  );
} 

const StoryCommentItem = ({ 
  id, 
  author, 
  created_at_i: time,
  text, 
  children, 
}) => {   // deconstruct props
  return (
    <StyledStoryCommentsItem>
      <p>{id} | {author} | {time}</p>
      <p>{text}</p>
      { children && (
        <StoryCommentsList storyCommentListData={children} />
      )}
    </StyledStoryCommentsItem>
  );
}
//#endregion

