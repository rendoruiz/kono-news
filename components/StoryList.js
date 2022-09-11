import Link from "next/link";
import { useQueries } from "react-query";

import { useStoryNavigation } from "../hooks/useStoryNavigation";
import { useStoryList } from "../hooks/useStoryList";

import { QUERY_KEY, reactQueryParams } from "../utils/constants";
import { getStoryData } from "../utils/functions";
import { useRouter } from "next/router";

export const StoryList = () => {
  const { listType } = useStoryNavigation();
  const { storyListPages, isLastPage, isLoading, isError, refetch, loadNextPage } = useStoryList(listType.apiQuery);

  if (isLoading || isError) { 
    return (
      <div>
        {isLoading && <p>Loading...</p>}
        {isError && (
          <>
            <p>Something went horribly wrong.</p>
            <button onClick={refetch}>Refresh</button>
          </>
        )}
      </div>
    );
  }

  return storyListPages && (
    <>
      {storyListPages.map((storyListPage) => (
        <StoryListPage 
          key={storyListPage.page}
          {...storyListPage}
        />
      ))}
      {!isLastPage && (
        <button type="button" onClick={loadNextPage}>
          Load More Stories
        </button>
      )}
    </>
  );
}

const StoryListPage = ({ page, pageIds }) => {
  const resultList = useQueries(
    pageIds.map((storyId) => ({ 
      queryKey: ['storyitem', storyId],
      queryFn: () => getStoryData(storyId),
      reactQueryParams
    }))
  );
  
  const isLoading = !resultList.find((story) => story.isLoading) ? false : true;

  return (
    <ul>
      {isLoading && <p>Loading...</p>}
      {!isLoading && resultList.map((result) => (
        <StoryItem 
          key={result.data.id}
          data={result.data}
          isError={result.isError}
          refetch={result.refetch}
        />
      ))}
    </ul>
  )
}

const StoryItem = ({ data: { id, title, author, points, post_count, time_mini }, isError, refetch }) => {
  const router = useRouter();

  const routeHrefQueryObject = {
    ...router.query,
    [QUERY_KEY.STORY_DISCUSSION_ID]: id,
  }
  const permalinkHrefObject = { query: {
      ...routeHrefQueryObject,
      [QUERY_KEY.IS_PERMALINK]: true,
    }
  }
  const discussionHrefObject = { query: {
      ...routeHrefQueryObject,
      [QUERY_KEY.IS_STORY_DISCUSSION_EXPANDED]: true,
    }
  }

  const openDiscussion = (e) => {
    e.preventDefault();
    refetch();
    router.push(discussionHrefObject, undefined, { shallow: true });
  }

  return (
    <li>
      <Link href={permalinkHrefObject} passHref>
        <a target='_blank' onClick={openDiscussion}>
          <p>{title}</p>
          <p>{points} points • {post_count} comments • {author}</p>
          <span>{time_mini}</span>
        </a>
      </Link>
    </li>
  );
}