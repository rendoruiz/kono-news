import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import StoryListPanel from "../../components/app/StoryListPanel";
import { parseStoryListModeId } from "../../utils/fetchApi";
import { viewport } from "../../styles/styledConstants";
import { NAVIGATION_ITEMS, STORYMODE, STORY_MODE_QUERY_KEY } from "../../utils/constants";
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
  const [currentStoryListModeId, setCurrentStoryListModeId] = useState(parseStoryListModeId(initialStoryListModeId));
  const [currentStoryCommentsId, setCurrentStoryCommentsId] = useState(initialStoryCommentsId);
  const [isNavigationPanelOpen, setIsNavigationPanelOpen] = useState(false);
  const [isStoryCommentsPanelOpen, setIsStoryCommentsPanelOpen] = useState(false);

  const handleStoryListModeChange = (newListMode) => setCurrentStoryListModeId(newListMode);
  const handleStoryCommentsIdChange = (newStoryCommentsId) => setCurrentStoryCommentsId(newStoryCommentsId);
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
    [STORY_MODE_QUERY_KEY]: listMode, 
    story: storyCommentsId 
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
  const router = useRouter();
  const handleModeChange = () => {
    onListModeChange(storyMode.id);
    router.push(
      { query: { [STORY_MODE_QUERY_KEY]: storyMode.id.toLowerCase() }}, 
      undefined, 
      { shallow: true }
    );
  }
  
  return (
    <button type='button' onClick={handleModeChange}>
      {storyMode.label}
    </button>
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

