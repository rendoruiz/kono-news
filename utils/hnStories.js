import axios from "axios";
import { getHackerNewsApiEndpoint } from ".";

export const getStoryIdList = async (storyType) => {
  const storyListEndpoint = getHackerNewsApiEndpoint(`${storyType}stories`);
  const response = await axios.get(storyListEndpoint);
  return response.data;
}

export const getStoryData = async (storyId) => {
  const storyDataEndpoint = getHackerNewsApiEndpoint(`item/${storyId}`);
  const response = await axios.get(storyDataEndpoint);
  return response.data;
}

export const getStoryListData = (storyIdList) => {
  return Promise.all(storyIdList.map((storyId) => getStoryData(storyId)));
}

export const getInitialStoriesData = async (storyType) => {
  const maxStoryPerPage = 30;
  const storyIdList = await getStoryIdList(storyType);
  const storyListData = await getStoryListData(storyIdList.slice(0, maxStoryPerPage));
  return [storyIdList, storyListData];
}

export const ListMode = {
  BEST: {
    label: 'News',
    apiKey: 'best',
  },
  NEW: {
    label: 'Newest',
    apiKey: 'new',
  },
  TOP: {
    label: 'Top',
    apiKey: 'top',
  },
  ASK: {
    label: 'Ask',
    apiKey: 'ask',
  },
  SHOW: {
    label: 'Show',
    apiKey: 'show',
  },
  JOBS: {
    label: 'Jobs',
    apiKey: 'job',
  },
};
export const getListMode = (listModeString) => {
  if (!listModeString) {
    return ListMode.BEST.apiKey;
  }

  const matchingMode = Object.keys(ListMode).find((mode) => mode.toLowerCase() === listModeString.toLowerCase());
  return !matchingMode 
    ? ListMode.BEST.apiKey 
    : ListMode[matchingMode].apiKey;
}