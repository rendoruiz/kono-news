import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";

import NavigationPanel from "../components/NavigationPanel";
import StoryListPanel from "../components/StoryListPanel";
import StoryCommentsPanel from "../components/StoryCommentsPanel";

import { parseStoryListModeId } from "../utils/fetchApi";
import { QUERY_KEY } from "../utils/constants";
import { viewport } from "../styles/styledConstants";

// shared states:
// object currentStoryMode = (onChange) => update routeQuery:mode
// int currentStoryModeId = (onChange) => update routeQuery:story 
// bool isNavigationPanelOpen
// bool isStoryCommentsPanelOpen

const StyledAppLayout = styled.div`
  position: relative;
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

  const handleStoryListModeChange = (newListMode) => {
    router.push(
      { query: { 
        ...router.query,
        [QUERY_KEY.STORY_MODE]: newListMode.toLowerCase(), 
      }}, 
      undefined, 
      { shallow: true }
    );
  };
  const handleStoryCommentsIdChange = (newStoryCommentsId) => {
    router.push(
      { query: { 
        ...router.query,
        [QUERY_KEY.STORY_COMMENTS_ID]: newStoryCommentsId, 
      }}, 
      undefined, 
      { shallow: true }
    );
  };

  useEffect(() => {
    const { 
      [QUERY_KEY.STORY_MODE]: storyListModeId, 
      [QUERY_KEY.STORY_COMMENTS_ID]: storyCommentsId, 
    } = router.query;

    if (storyListModeId && storyListModeId != currentStoryListModeId) {
      const parsedId = parseStoryListModeId(storyListModeId)
      setCurrentStoryListModeId(parsedId);
    }
    if (storyCommentsId && storyCommentsId != currentStoryCommentsId) {
      setCurrentStoryCommentsId(storyCommentsId);
    }
    // console.log(router.query)
  }, [router.query]);

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