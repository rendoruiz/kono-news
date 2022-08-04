import React from "react";
import Link from 'next/link';
import { useRouter } from "next/router";
import { useQuery } from 'react-query';
import clsx from "clsx";

import NavigationToggle from "./shared/NavigationToggle";
import ExternalLink from "./shared/ExternalLink";

import { useStory } from "../context/StoryContext";

import { getNavigationItemByStoryListId, getShortTime } from "../utils";
import { QUERY_KEY, reactQueryParams, STORIES_PER_PAGE } from "../utils/constants";
import { getInitialStoryListData, getStoryData } from "../utils/fetchApi";

const StoryListPanel = React.memo(({ storyListModeId }) => (
  <section className={clsx(
    'relative overflow-y-auto',
    'md:grid md:grid-rows-[auto_1fr]',
  )}>
    <StoryListHeader storyListModeId={storyListModeId} />
    {storyListModeId && (
      <StoryListContent storyListModeId={storyListModeId} />
    )}
  </section>
));

const StoryListHeader = React.memo(({ storyListModeId }) => {
  const listMode = getNavigationItemByStoryListId(storyListModeId);
  return (
    <header className={clsx(
      'sticky z-10 top-0 flex items-center py-2 px-1',
      'md:static',
    )}>
      <NavigationToggle />
      {listMode && (
        <h2 className='ml-2 text-2xl font-medium'>
          {listMode.label}
        </h2>
      )}
    </header>
  );
});

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
  if (isError || !fetchedStoryIds) {
    const { apiEndpoint, originalUrl} = error.cause;
    return (
      <div className='flex flex-col justify-center px-5 py-4 font-medium text-center'>
        <h3 className='text-heading1'>
          Something went wrong.
        </h3>
        <p className='mt-4 text-heading-2 text-knSecondary'>
          {error.message}
        </p>
        <p>
          <ExternalLink href={apiEndpoint}>
            API Endpoint
          </ExternalLink>
          <span className='mx-2'>•</span>
          <ExternalLink href={originalUrl}>
            YCombinator
          </ExternalLink>
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
            className='rounded mt-1 p-3 w-full text-knOrange/80 uppercase tracking-wide cursor-pointer select-none'
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
  const currentStoryDiscussionId = useStory();
  return (
    <ol className='grid content-start gap-y-[2px]'>
      {storyListData.map((storyItemData) => (
        <StoryItem
          key={storyItemData.id}
          storyItemData={storyItemData}
          isSelected={storyItemData.id == currentStoryDiscussionId}
        />
      ))}
    </ol>
  )
});

const StoryItem = React.memo(({ storyItemData, isSelected }) => {
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
    const { apiEndpoint, originalUrl} = error.cause;
    return (
      <li>
        <p>{error.message}</p>
        <p>
          <ExternalLink href={apiEndpoint}>
            API Endpoint
          </ExternalLink>
          <span className='mx-2'>•</span>
          <ExternalLink href={originalUrl}>
            YCombinator
          </ExternalLink>
        </p>
      </li>
    )
  }

  if (storyData) {
    const {
      id,
      title,
      by: author,
      score: points,
      time,
      descendants: post_count,
    } = storyData;
    const shortTime = getShortTime(time);

    const routeHrefObject = { 
      query: { 
        ...router.query,
        [QUERY_KEY.STORY_DISCUSSION_ID]: id, 
        [QUERY_KEY.IS_STORY_DISCUSSION_EXPANDED]: true,
      }
    }
  
    return (
      <li className='flex relative'>
        <Link
          href={routeHrefObject}
          shallow
        >
          <a className={clsx(
            'flex-1 relative rounded pl-3 pr-2 py-1.5 cursor-pointer select-none',
            {'bg-knItemSelected': isSelected},
            {'before:absolute before:inset-0 before:right-auto before:rounded before:my-auto before:w-1 before:h-1/2 before:bg-knOrange before:pointer-events-none': isSelected},
          )}>
            <p className={clsx(
              'font-serif text-sm leading-tight break-words',
              'md:text-base',
            )}>
              {title}
            </p>
            <div className={clsx(
              'flex mt-1 text-2xs text-FluentLightTextFillColorSecondary leading-none',
              'dark:text-FluentDarkTextFillColorSecondary',
              'md:text-xs',
            )}>
              <p>{points} points • {(!post_count || post_count == 0) ? 'no' : post_count} comments • {author}</p>
              <span className='shrink-0 ml-auto pl-0.5'>
                {shortTime}
              </span> 
            </div>
          </a>
        </Link>
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