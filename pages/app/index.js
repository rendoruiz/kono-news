import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import StoryListPanel from "../../components/app/StoryListPanel";
import { STORYMODE } from "../../utils/constants";
import { parseStoryListMode } from "../../utils/fetchApi";

//#region AppDashboard
const StyledAppLayout = styled.div`
  display: grid;
  min-width: 200px;
  width: 100vw;
  height: 100vh;
  
  background-color: rgb(246, 246, 239);
`;
const AppDashboard = ({ queryString, initialStoryListMode, initialStoryCommentsId, }) => {
  const storyListMode = initialStoryListMode;
  const storyCommentsId = initialStoryCommentsId;

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
      <StoryListPanel storyListMode={storyListMode} />

      {/* Story Comments Panel */}
      {/* 
        Component States:
        isExpanded, toggleSCPExpansion
      */}
      {/* 
        Shared Component States:
        selectedStoryItemData 
      */}
      <StoryCommentsPanel storyCommentsId={storyCommentsId} />
    </StyledAppLayout>
  );
}


export const getServerSideProps = async ({ query }) => {
  const { 
    mode: listMode, 
    story: storyCommentsId 
  } = query;

  return {
    props: {
      queryString: query,
      initialStoryListMode: listMode ?? null, 
      initialStoryCommentsId: storyCommentsId ?? null,
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

