import { NAVIGATION_ITEMS } from "./constants";

export const sanitizeHtmlLinks = (htmlText) => {
  if (!htmlText) {
    return null;
  }
  
  return !htmlText.includes('rel="nofollow"')
    ? htmlText
    : htmlText.split('rel="nofollow"').join('target="_blank" rel="noopener noreferrer"');
};

export const getUrlHostname = (url) => {
  if (!url) {
    return null;
  }

  return new URL(url).hostname.split('www.').join('');
}

export const getNavigationItemByStoryListId = (storyListId) => {
  if (!storyListId) {
    return null;
  }

  return NAVIGATION_ITEMS.filter((item) => item.id === storyListId).pop();
}