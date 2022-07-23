import { useQuery } from "react-query";
import { useRouter } from "next/router";

import { QUERY_KEY, reactQueryParams } from "../../utils/constants";
import { getStoryCommentsData } from "../../utils/fetchApi";
import { getRoundTime, getShortTime, getUrlHostname, sanitizeHtmlLinks } from "../../utils";
import * as Styled from "./styles";
import { FluentArrowLeftRegular, FluentCommentRegular, FluentDismissRegular, FluentKeyboardShiftRegular } from "../shared/FluentIcons";
import HtmlContent from "../shared/HtmlContent";

const StoryCommentsPanel = ({ isExpanded, isFocused, storyCommentsId }) => {
  const { isLoading, isError, data: storyCommentsData, error } = useQuery(
    ['storycommentsdata', storyCommentsId], 
    () => getStoryCommentsData(storyCommentsId),
    reactQueryParams
  );

  return (
    <Styled.StoryCommentsPanel 
      isExpanded={isExpanded}
      data-loading={isLoading ? "" : undefined}
      data-error={isError ? "" : undefined}
    >
      <StoryCommentsHeader 
        title={storyCommentsData?.title}
        isExpanded={isExpanded}
        isFocused={isFocused}
      />
      {isLoading && (
        <p>Loading story...</p>
      )}
      {isError && (
        <div>
          <h3>Cannot fetch Story Comments.</h3>
          <p>{error?.message}</p>
        </div>
      )}
      {storyCommentsData && (
        <StoryCommentsContent {...storyCommentsData} />
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
      <button
        type='button'
        onClick={handleTogglePanel}
        disabled={!isExpanded}
      >
        {isFocused ? (
          <FluentDismissRegular />
        ): (
          <FluentArrowLeftRegular />
        )}
      </button>
      <p>{title}</p>
    </Styled.StoryCommentsHeader>
  );
}

const StoryCommentsContent = ({ id, author, created_at_i: time, url, title, text, children, points, post_count }) => {
  const urlHostname = getUrlHostname(url);
  const roundTime = getRoundTime(time);

  return (
    <Styled.StoryCommentsContent>
      <Styled.StoryCommentsOriginalPost>
        <header>
          <h2>{title}</h2>
          <p>by {author} • {roundTime}</p>
          {urlHostname && (
            <a 
              href={url}
              target='_blank'
              rel='noopener noreferrer'
            >
              {urlHostname}
            </a>
          )}
        </header>
        <main>
          <HtmlContent htmlString={text} />
        </main>
        <footer>
          <span>
            <FluentKeyboardShiftRegular />
            {points}
          </span>
          <span>
            <FluentCommentRegular />
            {post_count}
          </span>
        </footer>
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
  } else {
    const shortTime = getShortTime(time);
    return (
      <Styled.StoryCommentsItem data-deleted={text ? undefined : ""}>
        <header>
          <p>{author} • {shortTime}</p>
        </header>
        <main>
          {text ? (
            <HtmlContent htmlString={text} />
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
}

export default StoryCommentsPanel;