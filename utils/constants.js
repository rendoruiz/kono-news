import { FluentArrowTrendingRegular, FluentChatHelpRegular, FluentHomeRegular, FluentNotepadPersonRegular, FluentRocketRegular, FluentTrophyRegular } from "../components/shared/FluentIcons";

export const STORY_MODE = {
  TOP: 'top',
  NEW: 'new',
  BEST: 'best',
  ASK: 'ask',
  SHOW: 'show',
  JOB: 'job',
}

export const QUERY_KEY = {
  STORY_LIST_MODE_ID: 'list',
  STORY_DISCUSSION_ID: 'story',
  IS_STORY_DISCUSSION_EXPANDED: 'discuss',
  IS_PERMALINK: 'permalink',
}

export const STORY_MODE_API_QUERY = [
  {
    id: STORY_MODE.TOP,
    apiQuery: 'topstories',
  },
  {
    id: STORY_MODE.NEW,
    apiQuery: 'newstories',
  },
  {
    id: STORY_MODE.BEST,
    apiQuery: 'beststories',
  },
  {
    id: STORY_MODE.ASK,
    apiQuery: 'askstories',
  },
  {
    id: STORY_MODE.SHOW,
    apiQuery: 'showstories',
  },
  {
    id: STORY_MODE.JOB,
    apiQuery: 'jobstories',
  },
];

export const NAVIGATION_ITEMS = [
  {
    id: STORY_MODE.TOP,
    label: 'Home',
    icon: <FluentHomeRegular />,
  },
  {
    id: STORY_MODE.NEW,
    label: 'New',
    icon: <FluentArrowTrendingRegular />,
  },
  {
    id: STORY_MODE.BEST,
    label: 'Best',
    icon: <FluentTrophyRegular />,
  },
  {
    id: STORY_MODE.ASK,
    label: 'Ask',
    icon: <FluentChatHelpRegular />,
  },
  {
    id: STORY_MODE.SHOW,
    label: 'Show',
    icon: <FluentRocketRegular />,
  },
  {
    id: STORY_MODE.JOB,
    label: 'Job',
    icon: <FluentNotepadPersonRegular />,
  },
];

export const NAVIGATION_ACTION = {
  SET_ID: 'NAVIGATION_SET_ID',
  TOGGLE_PANEL: 'NAVIGATION_TOGGLE_PANEL',
};
export const STORYDISCUSSION_ACTION = {
  SET_ID: 'STORYDISCUSSION_SET_ID',
  RETRACT_PANEL: 'STORYDISCUSSION_RETRACT_PANEL',
  DISABLE_PERMALINK: 'STORYDISCUSSION_DISABLE_PERMALINK',
};

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