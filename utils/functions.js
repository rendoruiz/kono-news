import axios from "axios";
import TimeAgo from "javascript-time-ago";
import en from 'javascript-time-ago/locale/en';

import { HN_API_ENDPOINT } from "./constants";

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');

export const getMiniTime = (unixTime) =>
  !unixTime ? null : timeAgo.format(new Date(unixTime * 1000), 'twitter');

export const throwAndLogError = (errorString) => {
  console.log(errorString);
  throw new Error(errorString);
}

const getStoryItemEndpoint = (storyId) =>
  `${HN_API_ENDPOINT}item/${storyId}.json`;

export const getStoryData = async (storyId) => {
  try {
    const response = await axios.get(getStoryItemEndpoint(storyId));
    return {
      id: response.data.id,
      title: response.data.title,
      url: response.data?.url,
      author: response.data.by,
      points: response.data.score,
      post_count: response.data.descendants,
      time_mini: getMiniTime(response.data.time),
    };
  } catch {
    throwAndLogError('[getStoryData]: Failed to connect to server');
  }
}