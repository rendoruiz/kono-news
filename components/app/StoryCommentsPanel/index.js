
import { useQuery } from "react-query";
import { decodeHTML } from "entities";
import styled from "@emotion/styled";
import { reactQueryParams } from "../../../utils/constants";
import { getStoryCommentsData } from "../../../utils/fetchApi";

//#region styles
const StyledStoryCommentsPanel = styled.section`
  overflow-y: auto;
`;
const StyledStoryCommentsHeader = styled.header``;
const StyledStoryCommentsContent = styled.main``;
const StyledStoryCommentsOriginalPost = styled.article``;
const StyledStoryCommentsList = styled.ol``;
const StyledStoryCommentsItem = styled.li`
  /* font-size: 0.9em; */
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