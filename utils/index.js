// https://github.com/HackerNews/API
const HN_ENDPOINT_PREFIX = 'https://hacker-news.firebaseio.com/v0/';
export const getHackerNewsApiEndpoint = (suffix) => HN_ENDPOINT_PREFIX + suffix + '.json';

// https://hn.algolia.com/api
export const ALGOLIA_ENDPOINT_PREFIX = 'https://hn.algolia.com/api/v1/';

export const sanitizeHtmlLinks = (htmlText) => {
  return !htmlText.includes('rel="nofollow"')
    ? htmlText
    : htmlText.split().join('target="_blank" rel="noopener noreferrer"');
};