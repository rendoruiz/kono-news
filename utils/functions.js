import TimeAgo from "javascript-time-ago";
import en from 'javascript-time-ago/locale/en';

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');

export const getMiniTime = (unixTime) =>
  !unixTime ? null : timeAgo.format(new Date(unixTime * 1000), 'twitter');