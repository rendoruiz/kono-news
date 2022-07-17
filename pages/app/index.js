import styled from "@emotion/styled";
import axios from "axios";
import { useEffect, useState } from "react";
import { useQueries } from "react-query";
import { STORYMODE } from "../../utils/constants";
import { getStoryCommentData, getStoryListIds } from "../../utils/getData";


const StyledAppLayout = styled.div`
  min-width: 300px;
  min-height: 400px;
  width: 100vw;
  height: 100vh;
  
  background-color: orchid;
`;
const AppPage = ({ query, initialStoryListIds, initialStoryCommentsData, storyListPage, }) => {
  const storyListIds = initialStoryListIds;
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
        storyListIds={storyListIds} 
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
const StyledStoryList = styled.ol``;
const StyledStoryItem = styled.li``;
const StoryListPanel = ({ storyListMode, storyListIds }) => {
  if (!storyListIds) {
    return null;
  }


  
  return (
    <StyledStoryListPanel>
      {/* header w/ nav toggle */}
      <StoryListHeader listMode={storyListMode} />

      {/* story list */}
      <StoryList storyListData={null} />

      {/* story list propagation button */}
      {/* {!isPageLimitReached && (
        <button 
          type='button'
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          load more
        </button>
      )} */}
    </StyledStoryListPanel>
  );
}

const StoryListHeader = ({ listMode }) => {   // deconstruct props
  return (
    <StyledStoryListHeader>

    </StyledStoryListHeader>
  );
}

const StoryList = ({ storyListData }) => {
  if (!storyListData) {
    return null;
  }

  return (
    <StyledStoryList>
      {storyListData.map((storyItemData, index) => 
        <Storyitem
          key={storyItemData.id ?? index}
          {...storyItemData}
        >

        </Storyitem>
      )}
    </StyledStoryList>
  );
}

const Storyitem = ({ 
  id,
  title,
  url,
  by: author,
  score: points,
  descendants: post_count,
}) => {
  return (
    <StyledStoryItem>
      {title}
    </StyledStoryItem>
  );
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

export default AppPage;