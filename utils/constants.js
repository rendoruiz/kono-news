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
    icon: null,
  },
  {
    id: STORY_MODE.NEW,
    label: 'New',
    icon: null,
  },
  {
    id: STORY_MODE.BEST,
    label: 'Best',
    icon: null,
  },
  {
    id: STORY_MODE.ASK,
    label: 'Ask',
    icon: null,
  },
  {
    id: STORY_MODE.SHOW,
    label: 'Show',
    icon: null,
  },
  {
    id: STORY_MODE.JOB,
    label: 'Job',
    icon: null,
  },
]

export const STORIES_PER_PAGE = 30;

const twentyFourHoursInMs = 1000 * 60 * 60 * 24;
export const reactQueryParams = {
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
  retry: false,
  staleTime: twentyFourHoursInMs,
}