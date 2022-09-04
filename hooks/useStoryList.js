import axios from "axios";
import { useEffect, useState } from "react"
import { useQuery } from "react-query";
import { HN_API_ENDPOINT, reactQueryParams } from "../utils/constants";

const DEFAULT_STORY_COUNT = 25;

const getStoryListEndpoint = (apiQuery) =>
  HN_API_ENDPOINT + apiQuery + '.json';

export const getStoryItemEndpoint = (storyId) =>
  `${HN_API_ENDPOINT}item/${storyId}.json`;

const throwAndLogError = (errorString) => {
  console.log(errorString);
  throw new Error(errorString);
}

const getStoryListIds = async (apiQuery) => {
  try {
    const response = await axios.get(getStoryListEndpoint(apiQuery));
    return response.data;
  } catch {
    throwAndLogError('[getStoryListIds]: Failed to connect to server');
  }
}

const getStoryData = async (storyId) => {
  try {
    const response = await axios.get(getStoryItemEndpoint(storyId));
    return response.data;
  } catch {
    throwAndLogError('[getStoryData]: Failed to connect to server');
  }
}

const getStoryListData = async (apiQuery, storyCount) => {
  if (!apiQuery) {
    return null;
  } else {
    try {
      const storyListIds = await getStoryListIds(apiQuery);
      const initialLoadedStoryIds = storyListIds.slice(0, storyCount);
      const initialLoadedStories = await Promise.all(
        initialLoadedStoryIds.map((storyId) => getStoryData(storyId))
      );
    
      return [
        ...initialLoadedStories.filter((data) => data).map((story) => { return {
          ...story,
          loaded: true,
        }}),
        ...storyListIds.slice(storyCount).map((id) => { return {
          id,
          loaded: false,
        }}),
      ];
    } catch (error) {
      throwAndLogError(`[getStoryListData]: ${error}`);
    }
  }
}

export const useStoryList = (apiQuery, storyCount = DEFAULT_STORY_COUNT) => {
  const [storyListIds, setStoryListIds] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPageLimitReached, setIsPageLimitReached] = useState(false);
  const { isLoading, isError, data: fetchedStoryListIds, refetch } = useQuery(
    ['storylist', apiQuery],
    () => getStoryListData(apiQuery, storyCount),
    reactQueryParams
  );

  useEffect(() => {
    if (fetchedStoryListIds) {
      setCurrentPage(1);
      setIsPageLimitReached(false);
      setStoryListIds(fetchedStoryListIds.slice(0, storyCount));
    }
  }, [fetchedStoryListIds]);

  useEffect(() => {
    if (fetchedStoryListIds) {
      setStoryListIds(fetchedStoryListIds.slice(0, storyCount * currentPage));
      if ((storyCount * currentPage) >= fetchedStoryListIds.length) {
        setIsPageLimitReached(true);
      }
    }
  }, [currentPage]);

  const loadMoreStories = () => setCurrentPage((prevState) => prevState + 1);

  return { storyListIds, isPageLimitReached, isLoading, isError, refetch, loadMoreStories }
}