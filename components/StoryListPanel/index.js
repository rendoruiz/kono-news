import { useState } from "react";
import { useQuery } from 'react-query';
import { useRouter } from "next/router";
import clsx from "clsx";

import NavigationToggle from "../shared/NavigationToggle";

import { QUERY_KEY, reactQueryParams, STORIES_PER_PAGE } from "../../utils/constants";
import { getInitialStoryListData, getStoryData } from "../../utils/fetchApi";
import { getNavigationItemByStoryListId, getShortTime, handleOnKeyDown } from "../../utils";

const StoryListPanel = ({ storyListModeId, onToggleNavigationPanel }) => (
  <section className='relative grid grid-rows-[auto,1fr] overflow-y-auto'>
    <StoryListHeader 
      storyListModeId={storyListModeId} 
      onToggleNavigationPanel={onToggleNavigationPanel} 
    />
    <StoryListContent storyListModeId={storyListModeId} />
  </section>
);

const StoryListHeader = ({ storyListModeId, onToggleNavigationPanel }) => {
  const listModeName = getNavigationItemByStoryListId(storyListModeId)?.label;
  return (
    <header className='sticky z-10 top-0 flex items-center pt-2 p-1 backdrop-blur-md'>
      <NavigationToggle onClick={onToggleNavigationPanel} />
      <h2 className='ml-2 text-heading2 font-medium'>
        {listModeName}
      </h2>
    </header>
  );
}

const StoryListContent = ({ storyListModeId }) => {
  const { isLoading, isError, data: fetchedStoryIds, error } = useQuery(
    ['storylist', storyListModeId], 
    () => getInitialStoryListData(storyListModeId, true),
    reactQueryParams
  );
  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = () => setCurrentPage(currentPage + 1);

  if (isLoading) {
    return (
      <ol className='grid content-start'>
        {[...Array(8)].map((_, index) => (
          <StoryItemSkeletonLoader key={index} />
        ))}
      </ol>
    );
  }
  if (isError) {
    return (
      <div className='flex flex-col justify-center px-5 py-4 font-medium text-center'>
        <h3 className='text-heading1 text-textPrimary'>
          Cannot fetch Story IDs.
        </h3>
        <p className='mt-4 text-heading-2 text-textSecondary'>
          {error?.message}
        </p>
      </div>
    );
  }

  if (fetchedStoryIds) {
    const currentItemCount = STORIES_PER_PAGE * currentPage;
    const isPageLimitReached = currentItemCount >= fetchedStoryIds.length
      ? true 
      : false;
    const storyListData = isPageLimitReached 
      ? fetchedStoryIds 
      : fetchedStoryIds.slice(0, currentItemCount);
    
    return (
      <main className='px-2 py-1 overflow-y-auto'>
        <StoryList storyListData={storyListData} />
        {/* story list propagation button */}
        {!isPageLimitReached && (
          <button 
            type='button'
            className='border-none rounded mt-1 px-3 py-1 w-full bg-none leading-none uppercase tracking-wide cursor-pointer'
            onClick={handlePageChange}
          >
            Load More
          </button>
        )}
      </main>
    );
  }
}

const StoryList = ({ storyListData }) => {
  return (
    <ol className='grid content-start gap-y-[2px]'>
      {storyListData.map((storyItemData) => (
        <StoryItem
          key={storyItemData.id}
          storyItemData={storyItemData}
        />
      ))}
    </ol>
  )
}

const StoryItem = ({ storyItemData }) => {
  const router = useRouter();
  const { isLoading, isError, data: storyData, error } = useQuery(
    ['storydata', storyItemData.id], 
    () => getStoryData(storyItemData.id),
    { 
      initialData: storyItemData.isDataEmpty ? undefined : storyItemData, 
      ...reactQueryParams
    }
  );

  if (isLoading) {
    return (
      <StoryItemSkeletonLoader />
    );
  }
  if (isError || !storyData) {
    return (
      <li>
        <p>Loading Story #{storyItemData} error: {error.message}</p>
      </li>
    )
  }

  if (storyData) {
    const {
      id,
      title,
      url,
      by: author,
      score: points,
      time,
      descendants: post_count,
    } = storyData;
    const controlId = 'story-item-' + id;
    const shortTime = getShortTime(time);
  
    const handleStoryCommentsChange = () => {
      router.push(
        { query: { 
          ...router.query,
          [QUERY_KEY.STORY_COMMENTS_ID]: id, 
          [QUERY_KEY.IS_STORY_COMMENTS_EXPANDED]: true,
        }}, 
        undefined, 
        { shallow: true }
      );
    }
  
    return (
      <li className='flex relative'>
        <input 
          type='radio' 
          name='story-item' 
          id={controlId} 
          className='peer absolute opacity-0 pointer-events-none'
          onKeyDown={(e) => handleOnKeyDown(e, handleStoryCommentsChange)} 
        />
        <label 
          htmlFor={controlId} 
          className={clsx([
            'flex-1 relative rounded pl-3 pr-2 py-6px cursor-pointer select-none',
          'peer-checked:bg-itemSelected',
            'peer-checked:before:absolute peer-checked:before:inset-0 peer-checked:before:right-auto peer-checked:before:rounded peer-checked:before:my-auto peer-checked:before:w-1 peer-checked:before:h-1/2 peer-checked:before:bg-brandOrange peer-checked:before:pointer-events-none'
          ])}
          onClick={() => handleStoryCommentsChange()}
        >
          <h3 className='text-base leading-tight break-words'>
            {title}
          </h3>
          <div className='flex mt-1 text-contentSecondary text-textSecondary leading-none stroke-textSecondary'>
            <p>{points} points • {post_count ?? 'no'} comments • {author}</p>
            <span className='shrink-0 ml-auto pl-2px'>
              {shortTime}
            </span> 
          </div>
        </label>
      </li>
    );
  }
}

const StoryItemSkeletonLoader = () => (
  <li className='hidden [&:nth-of-type(-n+8)]:grid [&:nth-of-type(-n+8)]:gap-y-[6px]'>
    <span className='rounded w-11/12 h-7 bg-black/30 animate-pulse odd:w-3/4' />
    <span className='rounded w-1/2 h-5 bg-black/30 animate-pulse odd:w-3/5' />
  </li>
);

export default StoryListPanel;