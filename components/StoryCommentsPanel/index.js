
import { useQuery } from "react-query";
import styled from "@emotion/styled";

import { reactQueryParams } from "../../utils/constants";
import { getStoryCommentsData } from "../../utils/fetchApi";
import { getUrlHostname, sanitizeHtmlLinks } from "../../utils";
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
  padding: 10px;
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
    display: grid;
    align-content: flex-start;
    margin-top: 4px;
    font-size: 0.9em;
  }
  &[data-deleted] > main > div {
    opacity: 0.6;
    font-style: italic;
  }

  /* > main > div pre {
    justify-self: flex-start;
  } */
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
        <p>Loading Story #{storyCommentsId} error: {error.message}</p>
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

const StoryCommentsContent = ({ id, author, created_at_i: time, url, title, text, children }) => {
  const decodedHtml = text ? sanitizeHtmlLinks(text) : null;
  const urlHostname = getUrlHostname(url);

  return (
    <StyledStoryCommentsContent>
      <StyledStoryCommentsOriginalPost>
        <header>
          <h2>{title}</h2>
          <p>{id} | {author} | {time}&nbsp;
          {urlHostname && (
            <a href={url}>
              | {urlHostname}
            </a>
          )}
          </p>
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
  // dont show deleted items with no children (id and time only)
  if (text === null && (children.length === 0)) {
    return null; 
  }

  const decodedHtml = text ? sanitizeHtmlLinks(text) : null;
  return (
    <StyledStoryCommentsItem data-deleted={decodedHtml ? undefined : ""}>
      <header>
        <p>{id} | {author} | {time}</p>
      </header>
      <main>
        {decodedHtml ? (
          <div dangerouslySetInnerHTML={{ __html: decodedHtml }} />
        ) : (
          <div>deleted comment</div>
        )}
        

        { children && (
          <StoryCommentsList storyCommentsListData={children} />
        )}
      </main>
    </StyledStoryCommentsItem>
  );
}

export default StoryCommentsPanel;