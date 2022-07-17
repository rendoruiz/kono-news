export const STORIES_PER_PAGE = 30;

const twentyFourHoursInMs = 1000 * 60 * 60 * 24;
export const storyDataQueryParams = {
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
  retry: false,
  staleTime: twentyFourHoursInMs,
}

export const STORYMODE = {
  TOP: {
    label: 'Home',
    apiQuery: 'topstories',
  },
  NEW: {
    label: 'Newest',
    apiQuery: 'newstories',
  },
  BEST: {
    label: 'Best',
    apiQuery: 'beststories',
  },
  ASK: {
    label: 'Ask',
    apiQuery: 'askstories',
  },
  SHOW: {
    label: 'Show',
    apiQuery: 'showstories',
  },
  JOB:  {
    label: 'Jobs',
    apiQuery: 'jobstories',
  },
}