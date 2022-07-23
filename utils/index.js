import TimeAgo from "javascript-time-ago";
import en from 'javascript-time-ago/locale/en'

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

export const handleOnKeyDown = (e, dispatch) => {
  const keyCode = e.code.toUpperCase();
    if (keyCode === "ENTER" || keyCode === "SPACE") {
      dispatch();
    }
}

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US')
export const getShortTime = (unixTime) =>
  timeAgo.format(new Date(unixTime * 1000), 'twitter');