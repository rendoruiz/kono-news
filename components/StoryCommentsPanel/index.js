import { useQuery } from "react-query";
import { useRouter } from "next/router";
import clsx from "clsx";

import HtmlContent from "../shared/HtmlContent";
import { FluentArrowLeftRegular, FluentCommentRegular, FluentDismissRegular, FluentKeyboardShiftRegular } from "../shared/FluentIcons";

import { QUERY_KEY, reactQueryParams } from "../../utils/constants";
import { getStoryCommentsData } from "../../utils/fetchApi";
import { getRoundTime, getShortTime, getUrlHostname } from "../../utils";

const StoryCommentsPanel = ({ isExpanded, isFocused, storyCommentsId }) => {
  const { isLoading, isError, data: storyCommentsData, error } = useQuery(
    ['storycommentsdata', storyCommentsId], 
    () => getStoryCommentsData(storyCommentsId),
    reactQueryParams
  );

  return (
    <section className={clsx(
      'fixed z-modal inset-0 bg-brandBackground translate-x-full transition-transform panel-transition overflow-y-auto pointer-events-none',
      {'!translate-x-0 !pointer-events-auto': isExpanded}
    )}>
      <StoryCommentsHeader 
        title={storyCommentsData?.title}
        isExpanded={isExpanded}
        isFocused={isFocused}
      />

      {isLoading && (
        <p className='grid place-items-center h-4/5 text-heading2'>
          Loading story...
        </p>
      )}
      {isError && (
        <div className='grid content-center px-4 py-5 font-medium text-center leading-5'>
          <h3 className='text-heading1'>
            Cannot fetch Story Comments.
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
    <header className='sticky z-10 top-0 flex items-center gap-2 py-2 px-1 bg-brandBackground/60 backdrop-blur-sm'>
      <button
        type='button'
        onClick={handleTogglePanel}
        disabled={!isExpanded}
        className={clsx(
          'group shrink-0 border-1 border-transparent rounded ml-1 px-2 py-1 leading-none transition-opacity cursor-pointer',
          'hover:opacity-50'
        )}
      >
        {isFocused ? (
          <FluentDismissRegular className={clsx(
            'w-7 h-7 origin-center transition-transform',
            'group-active:scale-[0.8]'
          )} />
        ): (
          <FluentArrowLeftRegular className={clsx(
            'w-7 h-7 origin-center transition-transform',
            'group-active:scale-[0.8]'
          )} />
        )}
      </button>
      <p className='flex-1 pr-1 text-contentPrimary font-medium leading-6 overflow-x-hidden text-ellipsis whitespace-nowrap'>
        {title}
      </p>
    </header>
  );
}

const StoryCommentsContent = ({ children, ...originalPostData }) => {

  return (
    <main className='grid grid-rows-[auto,1fr] gap-y-2 overflow-y-auto'>
      <StoryCommentsOriginalPost {...originalPostData} />

      {/* story comments list */}
      {children.length === 0 ? (
        <p>No comments.</p>
      ) : (
        <StoryCommentsList storyCommentsListData={children} />
      )}
    </main>
  );
}

const StoryCommentsOriginalPost = ({ id, title, author, created_at_i: time, url, text, points, post_count }) => {
  const urlHostname = getUrlHostname(url);
  const roundTime = getRoundTime(time);

  return (
    <article className={clsx(
      'border-b-3 border-b-black/10 py-2 px-4',
      '[&+ul]:mt-1 [&+ul]:ml-0 [&+ul]:py-0 [&+ul]:px-4',
      '[&+ul:before]:content-none'
    )}>
      <header className='flex flex-col'>
        <h2 className='text-title leading-tight'>
          {title}
        </h2>
        <p className='mt-1 text-contentSecondary text-brandSecondary'>
          by {author} • {roundTime}
        </p>
        {urlHostname && (
          <a 
            href={url}
            target='_blank'
            rel='noopener noreferrer'
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
}

const StoryCommentsList = ({ storyCommentsListData }) => {
  if (!storyCommentsListData) {
    return null;
  } else {
    return (
      <ul className={clsx(
        'relative mt-4 ml-[10px]',
        'before:absolute before:inset-y-0 before:right-auto before:left-[-10px] before:border-l-1.5 before:border-l-brandOrange/80',
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
      <li>
        <header className='flex justify-between items-center pb-2px text-[0.8em] text-brandSecondary tracking-wide'>
          <p>
            {author}
          </p>
          <span>{shortTime}</span>
        </header>
        <main className='mt-2px'>
          {text ? (
            <HtmlContent htmlString={text} />
          ) : (
            <p className='text-contentPrimary text-brandSecondary italic'>
              deleted comment
            </p>
          )}

          { children && (
            <StoryCommentsList storyCommentsListData={children} />
          )}
        </main>
      </li>
    );
  }
}

export default StoryCommentsPanel;