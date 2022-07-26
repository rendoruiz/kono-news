import React from 'react';
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import Link from 'next/link';
import Head from 'next/head';
import clsx from "clsx";

import HtmlContent from "../shared/HtmlContent";
import { FluentArrowLeftRegular, FluentCommentRegular, FluentDismissRegular, FluentKeyboardShiftRegular } from "../shared/FluentIcons";

import { getRoundTime, getShortTime, getStringCount, getUrlHostname } from "../../utils";
import { QUERY_KEY, reactQueryParams } from "../../utils/constants";
import { getStoryCommentsData } from "../../utils/fetchApi";

const StoryCommentsPanel = ({ isExpanded, isFocused, storyCommentsId }) => {
  const { isLoading, isError, data: storyCommentsData, error } = useQuery(
    ['storycommentsdata', storyCommentsId], 
    () => getStoryCommentsData(storyCommentsId),
    reactQueryParams
  );

  return (
    <> 
      {(isExpanded || isFocused) && storyCommentsData && (
        <Head>
          <title>Kono News | {storyCommentsData.title}</title>
        </Head>
      )}
      <section className={clsx(
        'fixed z-modal inset-0 bg-brandBackground translate-x-full transition-transform panel-transition overflow-y-auto pointer-events-none',
        {'!translate-x-0 !pointer-events-auto': isExpanded || isFocused},
        'md:static md:z-auto md:transform-none md:transition-none md:pointer-events-auto',
        'md:only:col-span-2 md:only:mx-auto md:only:max-w-screen-xl md:only:w-full'
      )}>
        <StoryCommentsHeader 
          title={storyCommentsData?.title}
          isExpanded={isExpanded}
          isFocused={isFocused}
          originalPostId={!storyCommentsData?.permalink ? null : storyCommentsData.id}
        />

        {isLoading && (
          <p className='grid place-items-center h-4/5 text-heading2'>
            Loading story...
          </p>
        )}
        {isError && (
          <div className='grid content-center px-4 py-5 font-medium text-center leading-5'>
            <h3 className='text-heading1'>
              Cannot fetch story comments.
            </h3>
            <p className='mt-4 text-heading3 text-brandSecondary'>
              {error?.message}
            </p>
          </div>
        )}
        {storyCommentsData && (
          <StoryCommentsContent {...storyCommentsData} />
        )}
      </section>
    </>
  );
}

const StoryCommentsHeader = ({ title, isExpanded, isFocused, originalPostId = null }) => {
  const router = useRouter();

  const handleTogglePanel = () => {
    if (isFocused) {
      const { 
        [QUERY_KEY.IS_STORY_COMMENTS_FOCUSED]: _,
        ...newRouterQuery 
      } = router.query;
      router.push(
        { query: {
          ...newRouterQuery,
          [QUERY_KEY.STORY_COMMENTS_ID]: originalPostId,
          [QUERY_KEY.IS_STORY_COMMENTS_EXPANDED]: true,
        } }, 
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
    <header className={clsx(
      'sticky z-10 top-0 flex items-center gap-2 py-2 px-1 bg-brandBackground/60 backdrop-blur-sm',
      'md:static'
    )}>
      {isFocused ? (
        <button
          type='button'
          onClick={handleTogglePanel}
          className={clsx(
            'group shrink-0 border-1 border-transparent rounded ml-1 px-2 py-1 leading-none transition-opacity cursor-pointer',
            'hover:opacity-50',
          )}
        >
          <FluentDismissRegular className={clsx(
            'w-7 h-7 origin-center transition-transform',
            'group-active:scale-[0.8]'
          )} />
        </button>
      ): (
        <button
          type='button'
          onClick={handleTogglePanel}
          disabled={!isExpanded}
          className={clsx(
            'group shrink-0 border-1 border-transparent rounded ml-1 px-2 py-1 leading-none transition-opacity cursor-pointer',
            'hover:opacity-50',
            'md:hidden',
          )}
        >
          <FluentArrowLeftRegular className={clsx(
            'w-7 h-7 origin-center transition-transform',
            'group-active:scale-[0.8]'
          )} />
        </button>

      )}
      
      <p className='flex-1 pr-1 text-contentPrimary font-medium leading-6 overflow-x-hidden text-ellipsis whitespace-nowrap'>
        {title}
      </p>
    </header>
  );
}

const StoryCommentsContent = React.memo(({ children, ...originalPostData }) => {
  return (
    <main className='grid grid-rows-[auto,1fr] gap-y-2 pb-3 overflow-y-auto'>
      <StoryCommentsOriginalPost {...originalPostData} />

      {/* story comments list */}
      {children.length === 0 ? (
        <p>No comments.</p>
      ) : (
        <StoryCommentsList storyCommentsListData={children} />
      )}
    </main>
  );
});

const StoryCommentsOriginalPost = React.memo(({ id, title, author, created_at_i: time, url, text, points, post_count, permalink }) => {
  const urlHostname = getUrlHostname(url);
  const roundTime = React.useMemo(() => getRoundTime(time), [time]);

  return (
    <article className={clsx(
      'border-b-3 border-b-black/10 py-2 px-3',
      '[&+ul]:mt-1 [&+ul]:ml-0 [&+ul]:py-0 [&+ul]:px-3',
      '[&+ul:before]:content-none',
      '[&+ul>li:first-of-type]:mt-0',
    )}>
      {permalink && (
        <p className={clsx(
          'grid rounded -mt-1 mb-3 p-2 bg-brandOrange/20 font-medium text-contentSecondary',
          'md:block md:text-center'
        )}>
          <span className='md:mr-1'>You are viewing a single comment thread.</span>
          <span>Press the close button to view the whole thread.</span>
        </p>
      )}

      <header className='flex flex-col'>
        <h2 className='text-title leading-tight'>
          {title}
        </h2>
        <p className='mt-1 text-contentSecondary text-brandSecondary'>
          by&nbsp;
          <StoryCommentsUserLink
            userId={author}
            className={clsx(
              'md:font-medium',
              'md:hover:underline'
            )}
          />
          &nbsp;•&nbsp;
          {roundTime}
        </p>
        {urlHostname && (
          <a 
            href={url}
            target='_blank'
            rel='noopener noreferrer'
            title='open story url'
            className='self-start border-1 border-brandOrange rounded-2xl mt-2 py-1 px-[10px] bg-brandOrange/5 text-[0.75em] font-medium leading-none uppercase'
          >
            {urlHostname}
          </a>
        )}
      </header>
      {text && (
        <main className='mt-3'>
          <HtmlContent htmlString={text} />
        </main>
      )}
      <footer className='grid grid-flow-col justify-start gap-x-3 mt-3 text-contentSecondary text-brandSecondary font-medium stroke-brandSecondary'>
        <span className='flex items-center'>
          <FluentKeyboardShiftRegular className='mr-1 w-4' />
          {points}
        </span>
        <span className='flex items-center'>
          <FluentCommentRegular className='mr-1 w-4' />
          {post_count}
        </span>
      </footer>
    </article>
  );
});

const StoryCommentsList = React.memo(({ storyCommentsListData }) => {
  if (!storyCommentsListData) {
    return null;
  } else {
    return (
      <ul className={clsx(
        'relative ml-[10px]',
        'before:absolute before:inset-y-0 before:right-auto before:left-[-10px] before:border-l-1.5 before:border-l-commentThread',
        'md:ml-[14px]',
        'md:before:left-[-14px]'
      )}>
        {storyCommentsListData.map((storyCommentItemData) =>
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

    const shortTime = React.useMemo(() => getShortTime(time), [time]);
    const radioId = `story-comment-item-${id}`;
    return (
      <li className='grid grid-cols-[auto,1fr] mt-4'>
        <StoryItemCommentVisibilityToggle radioButtonId={radioId}/>

        <header className={clsx(
          'col-start-2 grid grid-cols-[1fr,auto] items-center text-[0.8em] text-brandSecondary tracking-wide',
          '[&>*]:row-start-1',
          'md:flex'
        )}>
          {author ? (
            <StoryCommentsUserLink
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
              [QUERY_KEY.STORY_COMMENTS_ID]: id,
              [QUERY_KEY.IS_STORY_COMMENTS_FOCUSED]: true,
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
                'md:before:content-["•"] md:before:mx-1.5 md:before:inline-block md:before:text-brandSecondary'
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
          'col-span-2 mt-2px',
          'peer-checked:hidden'
        )}>
          {text ? (
            <HtmlContent htmlString={text} />
          ) : (
            <p className='text-contentPrimary text-brandSecondary italic'>
              deleted comment
            </p>
          )}

          { children && children.length > 0 && (
            <StoryCommentsList storyCommentsListData={children} />
          )}
        </main>
      </li>
    );
  }
});

const StoryCommentsUserLink = React.memo(({ userId, ...props }) => (
  <a
    href={'https://news.ycombinator.com/user?id=' + userId}
    target='_blank'
    rel='noopener noreferrer'
    title='open user page on ycombinator'
    {...props}
  >
    {userId}
  </a>
))

const StoryItemCommentVisibilityToggle = React.memo(({ radioButtonId }) => (
  <>
    <input type='checkbox' name='story-comment-item' id={radioButtonId} 
      className='peer absolute opacity-0 pointer-events-none'
    />
    <label 
      htmlFor={radioButtonId} 
      className='col-start-1 hidden pr-1 font-mono text-[0.8em] text-brandOrange select-none cursor-pointer peer-checked:block'
      title='expand comment thread'
    >
      [+]
    </label>
    <label 
      htmlFor={radioButtonId} 
      className='col-start-1 block pr-1 font-mono text-[0.8em] text-brandOrange/80 select-none cursor-pointer peer-checked:hidden'
      title='retract comment thread'
    >
      [-]
    </label>
  </>
));

export default StoryCommentsPanel;