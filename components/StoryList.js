import Link from "next/link";

import { useStoryNavigation } from "../hooks/useStoryNavigation";
import { useStoryList } from "../hooks/useStoryList";
import { useStoryItem } from "../hooks/useStoryItem";

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

  return storyListPages && !isError && (
    <>
      {storyListPages.map((storyListPage) => (
        <StoryListPage 
          key={storyListPage.page}
          {...storyListPage}
        />
      ))}
      {!isLastPage && (
        <button onClick={loadNextPage}>
          Load More Stories
        </button>
      )}
    </>
  );
}

const StoryListPage = ({ page, pageIds }) => {

  return (
    <ul>
      <h2>{page}</h2>
      <p>{JSON.stringify(pageIds)}</p>
    </ul>
  )
}

const StoryItem = ({ initialStoryData, isSelected }) => {
  const { storyData, isLoading, isError, openDiscussion } = useStoryItem(initialStoryData);

  if (isLoading || isError) {
    return (
      <div>
        {isLoading && <p>Loading...</p>}
        {isError && (
          <>
            <p>Something went horribly wrong.</p>
          </>
        )}
      </div>
    );
  }

  return storyData && !isError && (
    <li>
      <Link href={storyData.permalinkHrefObject} passHref>
        <a target='_blank' onClick={openDiscussion}>
          {storyData.title} | {storyData.time}
        </a>
      </Link>
    </li>
  );
}