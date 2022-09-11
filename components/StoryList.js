import Link from "next/link";
import { useQueries } from "react-query";

import { useStoryNavigation } from "../hooks/useStoryNavigation";
import { useStoryList } from "../hooks/useStoryList";
import { getStoryData, useStoryItem } from "../hooks/useStoryItem";

import { reactQueryParams } from "../utils/constants";

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
  const result = useQueries(
    pageIds.map((storyId) => ({ 
      queryKey: ['storyitem', storyId],
      queryFn: () => getStoryData(storyId),
      reactQueryParams
    }))
  );
  
  const isLoading = !result.find((story) => story.isLoading) ? false : true;

  return (
    <ul>
      {isLoading && <p>Loading...</p>}
      {!isLoading && result.map((resultItem) => (
        <StoryItem 
          key={resultItem.data.id}
          {...resultItem.data}
        />
      ))}
    </ul>
  )
}

const StoryItem = (storyData) => {
  // const { storyData, isLoading, isError, openDiscussion } = useStoryItem(initialStoryData);

  // if (isLoading || isError) {
  //   return (
  //     <div>
  //       {isLoading && <p>Loading...</p>}
  //       {isError && (
  //         <>
  //           <p>Something went horribly wrong.</p>
  //         </>
  //       )}
  //     </div>
  //   );
  // }

  return storyData && (
    <li>
      <Link href={storyData?.permalinkHrefObject ?? '#'} passHref>
        <a target='_blank' onClick={null}>
          {storyData.title}
        </a>
      </Link>
    </li>
  );
}