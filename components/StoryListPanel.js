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
import PillSelectedIndicator from "./shared/PillSelectedIndicator";

const StoryListPanel = React.memo(({ storyListModeId }) => (
  <section className={clsx(
    'relative overflow-y-auto',
    'md:grid md:grid-rows-[auto_1fr] md:border-1 md:border-FluentLightCardStrokeColorDefault md:bg-FluentLightCardBackgroundFillColorDefault md:shadow md:overflow-y-auto',
    'dark:md:border-FluentDarkCardStrokeColorDefault dark:md:bg-FluentDarkCardBackgroundFillColorDefault',
    '2xl:rounded-lg',
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
      'sticky z-10 top-0 flex items-center border-b-1 border-FluentLightDividerStrokeColorDefault px-5 pt-4 pb-3 bg-FluentLightSolidBackgroundFillColorBase',
      'dark:border-FluentDarkDividerStrokeColorDefault dark:bg-FluentDarkSolidBackgroundFillColorBase',
      'md:static md:px-4 md:py-3 md:bg-inherit',
      'dark:md:bg-inherit'
    )}>
      <NavigationToggle />
      {listMode && (
        <h2 className='ml-5 -mt-[1px] font-medium text-lg leading-none'>
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
      <ol className={clsx(
        'grid content-start py-0.5 divide-y-1 divide-FluentLightDividerStrokeColorDefault overflow-y-visible',
        'dark:divide-FluentDarkDividerStrokeColorDefault',
      )}>
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
        <p className={clsx(
          'mt-4 text-heading-2 text-FluentLightTextFillColorSecondary',
          'dark:text-FluentDarkTextFillColorSecondary'
        )}>
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
      <>
        <main className='overflow-y-auto'>
          <StoryList storyListData={storyListData} />

          {!isPageLimitReached && (
            <div className={clsx(
              'border-t-1 border-FluentLightDividerStrokeColorDefault',
              'dark:border-FluentDarkDividerStrokeColorDefault'
            )}>
              <button 
                type='button'
                className={clsx(
                  'rounded px-5 py-3.5 w-full font-bold text-base text-KonoAccentLight uppercase tracking-wide cursor-pointer select-none',
                  'hover:bg-FluentLightSubtleFillColorSecondary active:bg-FluentLightSubtleFillColorTertiary active:text-opacity-80',
                  'dark:text-KonoAccentDark',
                  'dark:hover:bg-FluentDarkSubtleFillColorSecondary dark:active:bg-FluentDarkSubtleFillColorTertiary',
                  'md:px-3 md:py-2.5 md:transition-colors',
                )}
                onClick={handlePageChange}
              >
                Load More
              </button>
            </div>
          )}
        </main>
      </>
    );
  }
});

const StoryList = React.memo(({ storyListData }) => {
  const currentStoryDiscussionId = useStory();
  return (
    <ol className={clsx(
      'grid content-start py-0.5 divide-y-1 divide-FluentLightDividerStrokeColorDefault',
      'dark:divide-FluentDarkDividerStrokeColorDefault',
    )}>
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
            'flex-1 relative px-3 py-2 cursor-pointer select-none',
            'hover:bg-FluentLightSubtleFillColorSecondary active:bg-FluentLightSubtleFillColorTertiary active:text-FluentLightTextFillColorTertiary',
            'dark:hover:bg-FluentDarkSubtleFillColorSecondary dark:active:bg-FluentDarkSubtleFillColorTertiary dark:active:text-FluentDarkTextFillColorTertiary',
            {'bg-FluentLightSubtleFillColorSecondary hover:bg-FluentLightSubtleFillColorTertiary': isSelected},
            {'dark:bg-FluentDarkSubtleFillColorSecondary dark:hover:bg-FluentDarkSubtleFillColorTertiary': isSelected},
          )}>
            <PillSelectedIndicator isSelected={isSelected} large />
            <p className={clsx(
              'font-serif text-sm leading-snug break-words tracking-wide',
              'md:text-base md:tracking-normal',
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
    'group hidden px-3 py-2',
    '[&:nth-of-type(-n+10)]:grid [&:nth-of-type(-n+10)]:gap-y-1'
  )}>
    <span className={clsx(
      'rounded w-11/12 h-6 bg-FluentLightSurfaceStrokeColorDefault animate-pulse',
      'group-odd:w-3/4',
      'dark:bg-FluentDarkSurfaceStrokeColorDefault'
    )} />
    <span className={clsx(
      'rounded w-1/2 h-5 bg-FluentLightSurfaceStrokeColorDefault animate-pulse',
      'group-odd:w-3/5',
      'dark:bg-FluentDarkSurfaceStrokeColorDefault'
    )} />
  </li>
));

export default StoryListPanel;