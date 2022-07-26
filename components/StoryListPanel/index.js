import React from "react";
import { useQuery } from 'react-query';
import { useRouter } from "next/router";
import clsx from "clsx";

import NavigationToggle from "../shared/NavigationToggle";

import { getNavigationItemByStoryListId, getShortTime, handleOnKeyDown } from "../../utils";
import { QUERY_KEY, reactQueryParams, STORIES_PER_PAGE } from "../../utils/constants";
import { getInitialStoryListData, getStoryData } from "../../utils/fetchApi";

const StoryListPanel = ({ storyListModeId, onToggleNavigationPanel }) => (
  <section className='relative overflow-y-auto'>
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
    <header className='sticky z-10 top-0 flex items-center py-2 px-1 bg-brandBackground/60 backdrop-blur-sm'>
      <NavigationToggle onClick={onToggleNavigationPanel} />
      <h2 className='ml-2 text-heading3 font-medium'>
        {listModeName}
      </h2>
    </header>
  );
}

const StoryListContent = React.memo(({ storyListModeId }) => {
  const { isLoading, isError, data: fetchedStoryIds, error } = useQuery(
    ['storylist', storyListModeId], 
    () => getInitialStoryListData(storyListModeId, true),
    reactQueryParams
  );
  const [currentPage, setCurrentPage] = React.useState(1);
  const handlePageChange = () => setCurrentPage(currentPage + 1);

  if (isLoading) {
    return (
      <ol className='grid content-start px-2 py-1 overflow-y-visible'>
        {[...Array(10)].map((_, index) => (
          <StoryItemSkeletonLoader key={index} />
        ))}
      </ol>
    );
  }
  if (isError) {
    return (
      <div className='flex flex-col justify-center px-5 py-4 font-medium text-center'>
        <h3 className='text-heading1 text-brandPrimary'>
          Cannot fetch Story IDs.
        </h3>
        <p className='mt-4 text-heading-2 text-brandSecondary'>
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
      <main className='px-1 py-1 overflow-y-auto'>
        <StoryList storyListData={storyListData} />
        {/* story list propagation button */}
        {!isPageLimitReached && (
          <button 
            type='button'
            className='rounded mt-1 p-3 w-full uppercase tracking-wide cursor-pointer select-none'
            onClick={handlePageChange}
          >
            Load More
          </button>
        )}
      </main>
    );
  }
});

const StoryList = React.memo(({ storyListData }) => {
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
});

const StoryItem = React.memo(({ storyItemData }) => {
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
          className={clsx(
            'flex-1 relative rounded pl-3 pr-2 py-6px cursor-pointer select-none',
          'peer-checked:bg-itemSelected',
            'peer-checked:before:absolute peer-checked:before:inset-0 peer-checked:before:right-auto peer-checked:before:rounded peer-checked:before:my-auto peer-checked:before:w-1 peer-checked:before:h-1/2 peer-checked:before:bg-brandOrange peer-checked:before:pointer-events-none'
          )}
          onClick={() => handleStoryCommentsChange()}
        >
          <h3 className='text-base leading-tight break-words'>
            {title}
          </h3>
          <div className='flex mt-1 text-contentSecondary text-brandSecondary leading-none stroke-textSecondary'>
            <p>{points} points • {post_count ?? 'no'} comments • {author}</p>
            <span className='shrink-0 ml-auto pl-2px'>
              {shortTime}
            </span> 
          </div>
        </label>
      </li>
    );
  }
});

const StoryItemSkeletonLoader = React.memo(() => (
  <li className={clsx(
    'group hidden py-1',
    '[&:nth-of-type(-n+10)]:grid [&:nth-of-type(-n+10)]:gap-y-1'
  )}>
    <span className={clsx(
      'rounded w-11/12 h-7 bg-black/30 animate-pulse',
      'group-odd:w-3/4'
    )} />
    <span className={clsx(
      'rounded w-1/2 h-5 bg-black/30 animate-pulse',
      'group-odd:w-3/5'
    )} />
  </li>
));

export default StoryListPanel;