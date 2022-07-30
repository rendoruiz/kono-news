import { FluentArrowTrendingRegular, FluentChatHelpRegular, FluentHomeRegular, FluentLightbulbFilamentRegular, FluentNotepadPersonRegular, FluentRewardRegular } from "../components/shared/FluentIcons";

export const STORY_MODE = {
  TOP: 'top',
  NEW: 'new',
  BEST: 'best',
  ASK: 'ask',
  SHOW: 'show',
  JOB: 'job',
}

export const QUERY_KEY = {
  STORY_MODE: 'list',
  STORY_COMMENTS_ID: 'story',
  IS_STORY_DISCUSSION_EXPANDED: 'discuss',
  IS_STORY_DISCUSSION_FOCUSED: 'permalink',
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
    icon: <FluentRewardRegular />,
  },
  {
    id: STORY_MODE.ASK,
    label: 'Ask',
    icon: <FluentChatHelpRegular />,
  },
  {
    id: STORY_MODE.SHOW,
    label: 'Show',
    icon: <FluentLightbulbFilamentRegular />,
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
  EXPAND_PANEL: 'STORYDISCUSSION_EXPAND_PANEL',
  RETRACT_PANEL: 'STORYDISCUSSION_RETRACT_PANEL',
  DISABLE_FOCUS: 'STORYDISCUSSION_DISABLE_FOCUS',
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