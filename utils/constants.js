export const QUERY_KEY = {
  STORY_LIST_TYPE_ID: 'list',
  IS_NAVIGATION_EXPANDED: 'nav',
  STORY_DISCUSSION_ID: 'story',
  IS_STORY_DISCUSSION_EXPANDED: 'discuss',
  IS_PERMALINK: 'permalink',
}

// export const STORYDISCUSSION_ACTION = {
//   SET_ID: 'STORYDISCUSSION_SET_ID',
//   RETRACT_PANEL: 'STORYDISCUSSION_RETRACT_PANEL',
//   DISABLE_PERMALINK: 'STORYDISCUSSION_DISABLE_PERMALINK',
// };

export const HN_API_ENDPOINT = 'https://hacker-news.firebaseio.com/v0/'

export const STORIES_PER_PAGE = 30;

const twentyFourHoursInMs = 1000 * 60 * 60 * 24;
export const reactQueryParams = {
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
  retry: false,
  staleTime: twentyFourHoursInMs,
}

export const LOCALSTORAGE_KEY = {
  APP_THEME: 'app_theme',
  INITIAL_THEME: 'initial_theme',
}

export const APP_THEME = {
  dark: 'dark',
  light: 'light',
}