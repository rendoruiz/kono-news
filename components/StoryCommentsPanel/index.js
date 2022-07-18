
import { useQuery } from "react-query";
import { decodeHTML } from "entities";
import styled from "@emotion/styled";

import { reactQueryParams } from "../../utils/constants";
import { getStoryCommentsData } from "../../utils/fetchApi";
import { viewport } from "../../styles/styledConstants";

//#region styles
const StyledStoryCommentsPanel = styled.section`
  position: relative;
  display: grid;
  grid-template-rows: auto 1fr;
  overflow-y: auto;
`;
const StyledStoryCommentsHeader = styled.header``;
const StyledStoryCommentsContent = styled.main`

  overflow-y: auto;
  display: grid;
  grid-template-rows: auto 1fr;
  row-gap: 20px;
`;
const StyledStoryCommentsOriginalPost = styled.article`
  background: rgba(50,50,50,0.5);

  + ul {
    margin-top: 0;
    margin-left: 0;
    padding: 0 10px;
  }
  + ul::before {
    content: none;
  }
`;
const StyledStoryCommentsList = styled.ul`
  position: relative;
  margin-top: 16px;
  margin-left: 10px;

  ::before {
    content: ' ';
    position: absolute;
    inset: 0 auto 0 -10px;
    border-left: 1.5px solid red;
  }

  ${viewport.md} {
    margin-left: 14px;

    ::before {
      left: -14px;
    }
  } 
`;
const StyledStoryCommentsItem = styled.li`
  > header {
    font-size: 0.8em;
    letter-spacing: 0.5px;
  }
  > main > div {
    margin-top: 4px;
    font-size: 0.9em;
  }
`;
//#endregion

const StoryCommentsPanel = ({ isOpen, storyCommentsId, onTogglePanel }) => {
  const { isLoading, isError, data: storyCommentsData, error } = useQuery(
    ['storycommentsdata', storyCommentsId], 
    () => getStoryCommentsData(storyCommentsId),
    reactQueryParams
  );

  if (isLoading) {
    return (
      <StyledStoryCommentsPanel data-loading>
        Loading story...
      </StyledStoryCommentsPanel>
    );
  }

  if (isError) {
    return (
      <StyledStoryCommentsPanel data-error>
        <p>Loading Story #{storyCommentsId} error: {error}</p>
      </StyledStoryCommentsPanel>
    )
  }

  return storyCommentsData && (
    <StyledStoryCommentsPanel>
      {/* header with: back button (close story), full screen, story urls */}
      <StoryCommentsHeader 
        id={storyCommentsId} 
      />

      <StoryCommentsContent {...storyCommentsData} />
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

const StoryCommentsContent = ({ id, author, time, title, text, children }) => {
  const decodedHtml = text ? decodeHTML(text) : null;
  return (
    <StyledStoryCommentsContent>
      <StyledStoryCommentsOriginalPost>
        <header>
          <h2>{title}</h2>
          <p>{id} | {author} | {time}</p>
        </header>
        <main dangerouslySetInnerHTML={{ __html: decodedHtml }}></main>
      </StyledStoryCommentsOriginalPost>

      {/* story comments list */}
      {children.length === 0 ? (
        <p>No comments.</p>
      ) : (
        <StoryCommentsList storyCommentsListData={children} />
      )}
    </StyledStoryCommentsContent>
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
}) => {
  const decodedHtml = text ? decodeHTML(text) : null;
  return (
    <StyledStoryCommentsItem>
      <header>
        <p>{id} | {author} | {time}</p>
      </header>
      <main>
        <div dangerouslySetInnerHTML={{ __html: decodedHtml }}></div>
        { children && (
          <StoryCommentsList storyCommentsListData={children} />
        )}
      </main>
    </StyledStoryCommentsItem>
  );
}

export default StoryCommentsPanel;