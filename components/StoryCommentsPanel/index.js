
import { useQuery } from "react-query";
import { useRouter } from "next/router";

import { QUERY_KEY, reactQueryParams } from "../../utils/constants";
import { getStoryCommentsData } from "../../utils/fetchApi";
import { getUrlHostname, sanitizeHtmlLinks } from "../../utils";
import * as Styled from "./styles";

const StoryCommentsPanel = ({ isExpanded, isFocused, storyCommentsId }) => {
  const { isLoading, isError, data: storyCommentsData, error } = useQuery(
    ['storycommentsdata', storyCommentsId], 
    () => getStoryCommentsData(storyCommentsId),
    reactQueryParams
  );

  return (
    <Styled.StoryCommentsPanel 
      isExpanded={isExpanded}
      data-loading={isLoading ? null : undefined}
      data-error={isError ? null : undefined}
    >
      {isLoading && ('Loading story...')}
      {isError && (
        <p>Loading Story #{storyCommentsId} error: {error.message}</p>
      )}

      {storyCommentsData && (
        <>
          <StoryCommentsHeader 
            title={storyCommentsData.title}
            isExpanded={isExpanded}
            isFocused={isFocused}
          />
          <StoryCommentsContent {...storyCommentsData} />
        </>
      )}
    </Styled.StoryCommentsPanel>
  );
}

const StoryCommentsHeader = ({ title, isExpanded, isFocused }) => {
  const router = useRouter();

  const handleTogglePanel = () => {
    if (isFocused) {
      const { 
        [QUERY_KEY.IS_STORY_COMMENTS_FOCUSED]: focused,
        ...newRouterQuery 
      } = router.query;
      router.replace(
        { query: newRouterQuery }, 
        undefined, 
        { shallow: true }
      );
    } else if (isExpanded) {
      const { 
        [QUERY_KEY.IS_STORY_COMMENTS_EXPANDED]: expanded,
        ...newRouterQuery 
      } = router.query;
      router.replace(
        { query: newRouterQuery }, 
        undefined, 
        { shallow: true }
      );
    }
  }

  return (
    <Styled.StoryCommentsHeader>
      {(isExpanded || isFocused) && (
        <button
          type='button'
          onClick={handleTogglePanel}
        >
          { isExpanded && 'expanded' }
          { isFocused && 'focused' }
        </button>
      )}
      <h1>{title}</h1>
    </Styled.StoryCommentsHeader>
  );
}

const StoryCommentsContent = ({ id, author, created_at_i: time, url, title, text, children }) => {
  const decodedHtml = text ? sanitizeHtmlLinks(text) : null;
  const urlHostname = getUrlHostname(url);

  return (
    <Styled.StoryCommentsContent>
      <Styled.StoryCommentsOriginalPost>
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
      </Styled.StoryCommentsOriginalPost>

      {/* story comments list */}
      {children.length === 0 ? (
        <p>No comments.</p>
      ) : (
        <StoryCommentsList storyCommentsListData={children} />
      )}
    </Styled.StoryCommentsContent>
  )

}

const StoryCommentsList = ({ storyCommentsListData }) => {
  if (!storyCommentsListData) {
    return null;
  }

  return (
    <Styled.StoryCommentsList>
      {storyCommentsListData.map((storyCommentItemData) =>
        <StoryCommentItem
          key={storyCommentItemData.id}
          {...storyCommentItemData}
        />
      )}
    </Styled.StoryCommentsList>
  
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
    <Styled.StoryCommentsItem data-deleted={decodedHtml ? undefined : ""}>
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
    </Styled.StoryCommentsItem>
  );
}

export default StoryCommentsPanel;