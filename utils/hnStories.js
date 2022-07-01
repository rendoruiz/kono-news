import axios from "axios";
import { HN_ENDPOINT_PREFIX } from ".";

export const getStoryIdList = async (storyType) => {
  const storyListEndpoint = HN_ENDPOINT_PREFIX + `${storyType}stories.json`;
  const response = await axios.get(storyListEndpoint);
  return response.data;
}

export const getStoryData = async (storyId) => {
  const storyDataEndpoint = HN_ENDPOINT_PREFIX + `item/${storyId}.json`;
  const response = await axios.get(storyDataEndpoint);
  return response.data;
}

export const getStoryListData = async (storyIdList) => {
  return await Promise.all(storyIdList.map((storyId) => getStoryData(storyId)));
}

export const getInitialStoriesData = async (storyType) => {
  const maxStoryPerPage = 30;
  const storyIdList = await getStoryIdList(storyType);
  const storyListData = await getStoryListData(storyIdList.slice(0, maxStoryPerPage));
  return [storyIdList, storyListData];
}