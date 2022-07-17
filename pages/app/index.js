import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import StoryListPanel from "../../components/app/StoryListPanel";
import { getStoryCommentsData, parseStoryListModeId } from "../../utils/fetchApi";
import { viewport } from "../../styles/styledConstants";
import { NAVIGATION_ITEMS, QUERY_KEY, reactQueryParams } from "../../utils/constants";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { decodeHTML } from "entities";

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



//#region storycomments
const StyledStoryCommentsPanel = styled.section`
  overflow-y: auto;
`;
const StyledStoryCommentsHeader = styled.div``;
const StyledStoryCommentsList = styled.ol``;
const StyledStoryCommentsItem = styled.li`
  font-size: 0.9em;
`;
const StoryCommentsPanel = ({ isOpen, storyCommentsId, onTogglePanel }) => {
  const { isLoading, isError, data: storyCommentsData, error } = useQuery(
    ['storycommentsdata', storyCommentsId], 
    () => getStoryCommentsData(storyCommentsId),
    reactQueryParams
  );

  if (isLoading) {
    return (
      <StyledStoryCommentsPanel data-loading />
    );
  }

  if (isError) {
    return (
      <StyledStoryCommentsPanel data-error>
        <p>Loading Story #{storyItemData} error: {error}</p>
      </StyledStoryCommentsPanel>
    )
  }

  return storyCommentsData && (
    <StyledStoryCommentsPanel>
      {/* header with: back button (close story), full screen, story urls */}
      <StoryCommentsHeader 
        id={storyCommentsId} 
      />

      {/* story comments list */}
      <StoryCommentsList storyCommentsListData={storyCommentsData.children} />
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
      <h1>{id}</h1>
    </StyledStoryCommentsHeader>
  )
}

const StoryCommentsList = ({ storyCommentsListData }) => {
  if (!storyCommentsListData) {
    return null;
  }

  return (
    <StyledStoryCommentsList>
      {storyCommentsListData.map((storyCommentItemData) =>
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
  const decodedHtml = text ? decodeHTML(text) : null;
  return (
    <StyledStoryCommentsItem>
      <p>{id} | {author} | {time}</p>
      <div dangerouslySetInnerHTML={{ __html: decodedHtml }}></div>
      { children && (
        <StoryCommentsList storyCommentsListData={children} />
      )}
    </StyledStoryCommentsItem>
  );
}
//#endregion

