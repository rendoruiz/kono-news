import React from 'react';
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import Link from 'next/link';
import Head from 'next/head';
import clsx from "clsx";

import HtmlContent from "./shared/HtmlContent";
import ExternalLink from './shared/ExternalLink';
import { FluentArrowLeftRegular, FluentClockRegular, FluentCommentRegular, FluentDismissRegular, FluentKeyboardShiftRegular, FluentPersonRegular } from "./shared/FluentIcons";

import { getRoundTime, getShortTime, getStringCount, getUrlHostname } from "../utils";
import { QUERY_KEY, reactQueryParams } from "../utils/constants";
import { getStoryDiscussionData } from "../utils/fetchApi";

const StoryDiscussionPanel = ({ isExpanded, isPermalink, storyDiscussionId }) => {
  const { isLoading, isError, data: storyDiscussionData, error } = useQuery(
    ['storycommentsdata', storyDiscussionId], 
    () => getStoryDiscussionData(storyDiscussionId),
    reactQueryParams
  );
  
  return (
    <> 
      {(isExpanded || isPermalink) && storyDiscussionData && (
        <Head>
          <title>Kono News | {storyDiscussionData.title}</title>
        </Head>
      )}
      
      <section className={clsx(
        'fixed z-modal inset-0 bg-FluentLightSolidBackgroundFillColorBase translate-x-full transition-transform overflow-y-auto pointer-events-none',
        'dark:bg-FluentDarkSolidBackgroundFillColorBase',
        {'!translate-x-0 !pointer-events-auto': isExpanded || isPermalink},
        'md:static md:z-auto md:grid md:grid-rows-[auto_1fr] md:border-1 md:border-FluentLightCardStrokeColorDefault md:w-full md:bg-FluentLightCardBackgroundFillColorDefault md:shadow md:transform-none md:transition-none md:pointer-events-auto',
        'md:only:col-span-2 md:only:mx-auto md:only:max-w-screen-xl',
        'dark:md:border-FluentDarkCardStrokeColorDefault dark:md:bg-FluentDarkCardBackgroundFillColorDefault',
        '2xl:rounded-lg'
      )}>
        <StoryDiscussionHeader 
          title={storyDiscussionData?.title}
          isExpanded={isExpanded}
          isPermalink={isPermalink}
          originalPostId={!storyDiscussionData?.permalink ? null : storyDiscussionData.id}
        />

        {isLoading && (
          <p className='grid place-items-center h-4/5 text-2xl'>
            Loading story...
          </p>
        )}
        {isError && (
          <div className={clsx(
            'flex flex-col justify-center px-5 py-4 h-4/5 font-medium text-center',
            'md:h-full'
          )}>
            <h3 className='text-4xl'>
              Something went wrong.
            </h3>
            <p className={clsx(
              'mt-2 mb-5 text-sm text-FluentLightTextFillColorSecondary',
              'dark:text-FluentDarkTextFillColorSecondary'
            )}>
              {error.message}
            </p>
            <div className={clsx(
              'text-sm text-KonoAccentLight',
              'dark:text-KonoAccentDark',
              '[&>:first-child]:mr-3'
            )}>
              <ExternalLink href={error.cause.apiEndpoint}>
                API Endpoint
              </ExternalLink>
              <ExternalLink href={error.cause.originalUrl}>
                YCombinator
              </ExternalLink>
            </div>
          </div>
        )}
        {storyDiscussionData && (
          <StoryDiscussionContent {...storyDiscussionData} />
        )}
      </section>
    </>
  );
}

const StoryDiscussionHeader = ({ title, isExpanded, isPermalink, originalPostId = null }) => {
  const router = useRouter();

  const handleTogglePanel = () => {
    if (isPermalink) {
      const { 
        [QUERY_KEY.IS_PERMALINK]: _,
        ...newRouterQuery 
      } = router.query;
      router.push(
        { query: {
          ...newRouterQuery,
          [QUERY_KEY.STORY_DISCUSSION_ID]: originalPostId,
          [QUERY_KEY.IS_STORY_DISCUSSION_EXPANDED]: true,
        } }, 
        undefined, 
        { shallow: true }
      );
    } else if (isExpanded) {
      const { 
        [QUERY_KEY.IS_STORY_DISCUSSION_EXPANDED]: _,
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
    <header className={clsx(
      'sticky z-10 top-0 flex items-center border-b-1 border-FluentLightDividerStrokeColorDefault px-5 pt-4 pb-3 bg-inherit',
      'dark:border-FluentDarkDividerStrokeColorDefault',
      'md:static md:p-3',
      {'md:px-4': isPermalink},
      'xl:px-4'
    )}>
      <button
        type='button'
        onClick={handleTogglePanel}
        disabled={(!isExpanded && !isPermalink)}
        className={clsx(
          'shrink-0 group rounded -mx-3 mr-2 -my-2 px-3 py-2 leading-none cursor-pointer',
          'hover:bg-FluentLightSubtleFillColorSecondary active:bg-FluentLightSubtleFillColorTertiary active:text-FluentLightTextFillColorTertiary',
          'dark:hover:bg-FluentDarkSubtleFillColorSecondary dark:active:bg-FluentDarkSubtleFillColorTertiary dark:active:text-FluentDarkTextFillColorTertiary',
          'md:border-1 md:border-transparent',
          'md:hover:border-FluentLightControlStrokeColorDefault md:active:border-FluentLightControlStrokeColorSecondary md:hover:bg-FluentLightControlFillColorSecondary md:active:bg-FluentLightControlFillColorTertiary md:hover:shadow',
          'dark:md:hover:border-FluentDarkControlStrokeColorDefault dark:md:active:border-FluentDarkControlStrokeColorSecondary dark:md:hover:bg-FluentDarkControlFillColorSecondary dark:md:active:bg-FluentDarkControlFillColorTertiary',
          {'md:-mr-3 md:w-0 md:opacity-0 md:pointer-events-none': !isPermalink},
        )}
      >
        <div className={clsx(
          'w-6 h-6 origin-center transition-transform',
          'md:w-5 md:h-5',
          isPermalink ? 'group-active:scale-75' : 'group-active:scale-x-[0.80] group-active:translate-x-1.5',
        )}>
          {isPermalink ? (
            <FluentDismissRegular />
          ) : (
            <FluentArrowLeftRegular />
          )}
        </div>
      </button>
      
      <p className={clsx(
        'flex-1 pr-1 -my-1 font-bold text-sm tracking-wide overflow-x-hidden text-ellipsis whitespace-nowrap',
      )}>
        {title}
      </p>
    </header>
  );
}

const StoryDiscussionContent = React.memo(({ children, ...originalPostData }) => {
  return (
    <main className='overflow-y-auto'>
      <StoryDiscussionOriginalPost {...originalPostData} />

      {/* story comments list */}
      {children.length === 0 ? (
        <p>No comments.</p>
      ) : (
        <StoryDiscussionList storyDiscussionListData={children} />
      )}
    </main>
  );
});

const StoryDiscussionOriginalPost = React.memo(({ id, title, author, created_at_i: time, url, text, points, post_count, permalink }) => {
  const urlHostname = getUrlHostname(url);
  const roundTime = getRoundTime(time);

  return (
    <article className={clsx(
      'border-b-3 border-FluentLightDividerStrokeColorDefault p-3',
      'dark:border-FluentDarkDividerStrokeColorDefault',
      '[&+ul]:ml-0 [&+ul]:py-3 [&+ul]:divide-y-1 [&+ul]:divide-FluentLightDividerStrokeColorDefault',
      'dark:[&+ul]:divide-FluentDarkDividerStrokeColorDefault',
      '[&+ul:before]:content-none',
      '[&+ul>li]:mt-3 [&+ul>li]:pt-2.5 [&+ul>li]:px-3',
      '[&+ul>li:first-of-type]:mt-0 [&+ul>li:first-of-type]:pt-0',
      'xl:px-4',
      'xl:[&+ul>li]:px-4',
    )}>
      {permalink && (
        <p className={clsx(
          'grid rounded -mt-1 mb-2 p-2 bg-FluentLightSystemFillColorCautionBackground font-medium text-xs text-center',
          'dark:bg-FluentDarkSystemFillColorCautionBackground',
          'md:block'
        )}>
          <span className='md:mr-1'>You are viewing a single comment thread.</span>
          <span>Press the close button to view the whole thread.</span>
        </p>
      )}

      <header className='flex flex-col max-w-3xl'>
        <h2 className='font-serif text-3xl leading-snug'>
          {title}
        </h2>
        <div className={clsx(
          'mt-1 flex flex-wrap items-center text-xs text-FluentLightTextFillColorSecondary',
          'dark:text-FluentDarkTextFillColorSecondary',
          '[&>:not(:last-child)]:mr-3',
        )}>
          <span className='flex items-center'>
            <FluentKeyboardShiftRegular className='mr-1 w-4 h-4' />
            {points}
          </span>
          <span className='flex items-center'>
            <FluentCommentRegular className='mr-1 w-4 h-4' />
            {post_count}
          </span>
          <span className='flex items-center'>
            <FluentPersonRegular className='mr-1 w-4 h-4' />
            <StoryDiscussionUserLink
              userId={author}
              className={clsx(
                'md:font-medium',
                'md:hover:underline'
              )}
            />
          </span>
          <span className='flex items-center'>
            <FluentClockRegular className='mr-1 w-4 h-4' />
            {roundTime}
          </span>
        </div>
        {urlHostname && (
          <ExternalLink
            href={url}
            title='open story url'
            className={clsx(
              'self-start border-1 border-KonoAccentLight rounded-2xl mt-3 py-1.5 px-2.5 bg-KonoAccentLight/5 font-medium text-2xs leading-none uppercase',
              'dark:border-KonoAccentDark dark:bg-KonoAccentDark/10'
            )}
          >
            {urlHostname}
          </ExternalLink>
        )}
      </header>
      {text && (
        <main className='mt-3'>
          <HtmlContent htmlString={text} />
        </main>
      )}
    </article>
  );
});

const StoryDiscussionList = React.memo(({ storyDiscussionListData }) => {
  if (!storyDiscussionListData) {
    return null;
  } else {
    return (
      <ul className={clsx(
        'relative ml-2.5',
        'before:absolute before:inset-y-0 before:right-auto before:-left-2.5 before:border-l-2 before:border-dashed before:border-FluentLightControlStrokeColorSecondary',
        'dark:before:border-FluentDarkControlStrokeColorSecondary',
        'md:ml-3.5',
        'md:before:-left-3.5'
      )}>
        {storyDiscussionListData.map((storyCommentItemData) =>
          <StoryCommentItem
            key={storyCommentItemData.id}
            {...storyCommentItemData}
          />
        )}
      </ul>
    );
  }
});

const StoryCommentItem = React.memo(({ 
  id, 
  author, 
  created_at_i: time,
  text, 
  children, 
}) => {
  // dont show deleted items with no children (id and time only)
  if (text === null && children.length === 0) {
    return null; 
  } else {
    // return nothing if the whole comment thread only has empty comment text
    if (text === null) {
      const userCount = getStringCount(children, '"title":null');
      const emptyCommentCount = getStringCount(children, '"text":null');
      if (userCount === emptyCommentCount) {
        return null;
      }
    }

    const shortTime = getShortTime(time);
    const radioId = `story-comment-item-${id}`;
    return (
      <li className='grid grid-cols-[auto_1fr] mt-4'>
        <StoryItemCommentVisibilityToggle radioButtonId={radioId}/>

        <header className={clsx(
          'col-start-2 grid grid-cols-[1fr_auto] items-center text-2xs text-FluentLightTextFillColorSecondary tracking-wide',
          'dark:text-FluentDarkTextFillColorSecondary',
          '[&>*]:row-start-1',
          'md:flex md:text-xs',
        )}>
          {author ? (
            <StoryDiscussionUserLink
              userId={author}
              className={clsx(
                'col-start-1 pointer-events-none',
                'md:ml-1.5 md:font-medium md:pointer-events-auto',
                'md:hover:underline'
              )}
            />
          ) : (
            <span className='col-start-1'>[deleted author]</span>
          )}
          <Link 
            href={{ query: {
              [QUERY_KEY.STORY_DISCUSSION_ID]: id,
              [QUERY_KEY.IS_PERMALINK]: true,
            }}} 
            passHref
          >
            <a 
              target='_blank'
              title='open comment permalink'
              className={clsx(
                'pl-1.5',
                'md:pl-0',
                'md:hover:underline',
                'md:before:content-["•"] md:before:mx-1.5 md:before:inline-block md:before:text-FluentLightTextFillColorSecondary',
                'dark:text-FluentDarkTextFillColorSecondary',
              )}
            >
              {shortTime}
            </a>
          </Link>

          <label 
            htmlFor={radioId}
            className={clsx(
              'col-start-1 h-full cursor-pointer',
              'md:hidden md:pointer-events-none',
            )}
            title='comment expansion toggle'
          >
          </label>
        </header>
        <main className={clsx(
          'col-span-2 mt-0.5',
          'peer-checked:hidden'
        )}>
          {text ? (
            <HtmlContent htmlString={text} />
          ) : (
            <p className={clsx(
              'text-sm text-FluentLightTextFillColorSecondary italic',
              'dark:text-FluentDarkTextFillColorSecondary'

            )}>
              deleted comment
            </p>
          )}

          { children && children.length > 0 && (
            <StoryDiscussionList storyDiscussionListData={children} />
          )}
        </main>
      </li>
    );
  }
});

const StoryDiscussionUserLink = React.memo(({ userId, ...props }) => (
  <ExternalLink
    href={'https://news.ycombinator.com/user?id=' + userId}
    title='open user page on ycombinator'
    {...props}
  >
    {userId}
  </ExternalLink>
));

const StoryItemCommentVisibilityToggle = React.memo(({ radioButtonId }) => (
  <>
    <input type='checkbox' name='story-comment-item' id={radioButtonId} 
      className='peer absolute opacity-0 pointer-events-none'
    />
    <label 
      htmlFor={radioButtonId} 
      className={clsx(
        'col-start-1 hidden pr-1 font-mono text-xs text-KonoAccentLight select-none cursor-pointer',
        'peer-checked:block',
        'dark:text-KonoAccentDark',
      )}
      title='expand comment thread'
    >
      [+]
    </label>
    <label 
      htmlFor={radioButtonId} 
      className={clsx(
        'col-start-1 block pr-1 font-mono text-xs text-KonoAccentLight select-none cursor-pointer',
        'peer-checked:hidden',
        'dark:text-KonoAccentDark'
      )}
      title='retract comment thread'
    >
      [-]
    </label>
  </>
));

export default StoryDiscussionPanel;