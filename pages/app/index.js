import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import StoryListPanel from "../../components/app/StoryListPanel";
import { parseStoryListMode } from "../../utils/fetchApi";

// shared states:
// object currentStoryMode = (onChange) => update routeQuery:mode
// int currentStoryModeId = (onChange) => update routeQuery:story 
// bool isNavigationPanelOpen
// bool isStoryCommentsPanelOpen

const StyledAppLayout = styled.div`
  display: grid;
  min-width: 200px;
  width: 100vw;
  height: 100vh;
  background-color: rgb(246, 246, 239);
`;

const AppDashboard = ({ queryString, initialStoryListMode, initialStoryCommentsId, }) => {
  const [currentStoryListMode, setCurrentStoryListMode] = useState(parseStoryListMode(initialStoryListMode));
  const [currentStoryCommentsId, setCurrentStoryCommentsId] = useState(initialStoryCommentsId);
  const [isNavigationPanelOpen, setIsNavigationPanelOpen] = useState(false);
  const [isStoryCommentsPanelOpen, setIsStoryCommentsPanelOpen] = useState(false);

  const handleStoryListModeChange = (newListMode) => setCurrentStoryListMode(newListMode);
  const handleStoryCommentsIdChange = (newStoryCommentsId) => setCurrentStoryCommentsId(newStoryCommentsId);
  const handleToggleNavigationPanel = () => setIsNavigationPanelOpen(!isNavigationPanelOpen);
  const handleToggleStoryCommentsPanel = () => setIsStoryCommentsPanelOpen(!isStoryCommentsPanelOpen);

  return (  
    <StyledAppLayout>
      <NavigationPanel  
        isOpen={isNavigationPanelOpen}
        storyListMode={currentStoryListMode}
        onListModeChange={handleStoryListModeChange}
        onTogglePanel={handleToggleNavigationPanel}
      />

      <StoryListPanel 
        storyListMode={currentStoryListMode} 
        onStoryItemClick={handleStoryCommentsIdChange}
        onToggleNavigationPanel={handleToggleNavigationPanel}
        onToggleStoryCommentsPanel={handleToggleStoryCommentsPanel}
      />

      <StoryCommentsPanel 
        isOpen={isStoryCommentsPanelOpen}
        storyCommentsId={currentStoryCommentsId} 
        onTogglePanel={handleToggleStoryCommentsPanel}
      />
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


//#region Navigation Panel
const StyledNavigationPanel = styled.section``;

const NavigationPanel = ({ isOpen, storyListMode, onListModeChange, onTogglePanel, }) => {
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

