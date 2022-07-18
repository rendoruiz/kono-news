import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import StoryListPanel from "../components/app/StoryListPanel";
import StoryCommentsPanel from "../components/StoryCommentsPanel";
import { parseStoryListModeId } from "../utils/fetchApi";
import { viewport } from "../styles/styledConstants";
import { NAVIGATION_ITEMS, QUERY_KEY } from "../utils/constants";
import { useRouter } from "next/router";

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

  ${viewport.md} {
    display: grid;
    grid-template-columns: auto 1fr 2fr;
  }
`;

const AppDashboard = ({ queryString, initialStoryListModeId, initialStoryCommentsId, }) => {
  const router = useRouter(); 
  const [currentStoryListModeId, setCurrentStoryListModeId] = useState(parseStoryListModeId(initialStoryListModeId));
  const [currentStoryCommentsId, setCurrentStoryCommentsId] = useState(initialStoryCommentsId);
  const [isNavigationPanelOpen, setIsNavigationPanelOpen] = useState(false);
  const [isStoryCommentsPanelOpen, setIsStoryCommentsPanelOpen] = useState(false);

  const handleStoryListModeChange = (newListMode) => setCurrentStoryListModeId(newListMode);;
  const handleStoryCommentsIdChange = (newStoryCommentsId) => setCurrentStoryCommentsId(newStoryCommentsId);

  useEffect(() => {
    router.push(
      { query: { 
        ...router.query,
        [QUERY_KEY.STORY_MODE]: currentStoryListModeId.toLowerCase(), 
      }}, 
      undefined, 
      { shallow: true }
    );
  }, [currentStoryListModeId]);

  useEffect(() => {
    router.push(
      { query: { 
        ...router.query,
        [QUERY_KEY.STORY_COMMENTS_ID]: currentStoryCommentsId, 
      }}, 
      undefined, 
      { shallow: true }
    );
  }, [currentStoryCommentsId])

  const handleToggleNavigationPanel = () => setIsNavigationPanelOpen(!isNavigationPanelOpen);
  const handleToggleStoryCommentsPanel = () => setIsStoryCommentsPanelOpen(!isStoryCommentsPanelOpen);

  return (  
    <StyledAppLayout>
      <NavigationPanel  
        isOpen={isNavigationPanelOpen}
        storyListModeId={currentStoryListModeId}
        onListModeChange={handleStoryListModeChange}
        onTogglePanel={handleToggleNavigationPanel}
      />

      <StoryListPanel 
        storyListModeId={currentStoryListModeId} 
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
    [QUERY_KEY.STORY_MODE]: listMode, 
    [QUERY_KEY.STORY_COMMENTS_ID]: storyCommentsId 
  } = query;

  return {
    props: {
      queryString: query,
      initialStoryListModeId: listMode ?? null, 
      initialStoryCommentsId: storyCommentsId ?? null,
    }
  }
}

export default AppDashboard;


//#region Navigation Panel
const StyledNavigationPanel = styled.section`

`;
const StyledNavigationList = styled.ul`
  display: grid;
`;

const NavigationPanel = ({ isOpen, storyListModeId, onListModeChange, onTogglePanel, }) => {
  return (
    <StyledNavigationPanel>
      <NavigationList
        storyListModeId={storyListModeId}
        onListModeChange={onListModeChange}
        onTogglePanel={onTogglePanel}
      />
    </StyledNavigationPanel>
  );
}

const NavigationList = ({ storyListModeId, onListModeChange, onTogglePanel }) => {
  return (
    <StyledNavigationList>
      {NAVIGATION_ITEMS.map((storyMode) => (
        <NavigationItem
          key={storyMode.label}
          storyMode={storyMode}
          onListModeChange={onListModeChange}
          onTogglePanel={onTogglePanel}
        />
      ))}
    </StyledNavigationList>
  )
}



const NavigationItem = ({ storyMode, onListModeChange, onTogglePanel }) => {
  return (
    <button type='button' onClick={() => onListModeChange(storyMode.id)}>
      {storyMode.label}
    </button>
  )
}
//#endregion
