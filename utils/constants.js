import { FluentArrowTrendingRegular, FluentChatHelpRegular, FluentHomeRegular, FluentLightbulbFilamentRegular, FluentNotepadPersonRegular, FluentRewardRegular } from "../components/shared/FluentIcons";

export const STORY_MODE = {
  TOP: 'TOP',
  NEW: 'NEW',
  BEST: 'BEST',
  ASK: 'ASK',
  SHOW: 'SHOW',
  JOB: 'JOB',
}

export const QUERY_KEY = {
  STORY_MODE: 'mode',
  STORY_COMMENTS_ID: 'story',
  IS_NAVIGATION_EXPANDED: 'np',
  IS_STORY_COMMENTS_EXPANDED: 'scp',
  IS_STORY_COMMENTS_FOCUSED: 'focus',
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
  EXPAND_PANEL: 'NAVIGATION_EXPAND_PANEL',
  RETRACT_PANEL: 'NAVIGATION_RETRACT_PANEL',
};
export const STORYCOMMENTS_ACTION = {
  SET_ID: 'STORYCOMMENTS_SET_ID',
  EXPAND_PANEL: 'STORYCOMMENTS_EXPAND_PANEL',
  RETRACT_PANEL: 'STORYCOMMENTS_RETRACT_PANEL',
  DISABLE_FOCUS: 'STORYCOMMENTS_DISABLE_FOCUS',
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