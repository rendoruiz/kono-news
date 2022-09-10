import axios from "axios";
import { useEffect, useReducer, useState } from "react"
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

const initialState = {
  currentPage: 1,
  isPageEnd: false,
  storyListIds: null,
}

const ACTION = {
  INITIALIZE_LIST: 'INITIALIZE_LIST',
  UPDATE_LIST: 'UPDATE_LIST',
  INCREASE_PAGE: 'INCREASE_PAGE',
  TOGGLE_PAGE_END: 'TOGGLE_PAGE_END',
}

const storyListReducer = (state, action) => {
  switch (action.type) {
    case ACTION.INITIALIZE_LIST:
      return {
        ...state,
        ...initialState,
        storyListIds: action.storyListIds,
      }
    case ACTION.UPDATE_LIST:
      return {
        ...state,
        storyListIds: action.storyListIds,
      }
    case ACTION.INCREASE_PAGE:
      return {
        ...state,
        currentPage: state.currentPage + 1,
      }
    case ACTION.TOGGLE_PAGE_END:
      return {
        ...state,
        isPageEnd: true,
      }
    default:
      return state;
  }
}

export const useStoryList = (apiQuery, storyCount = DEFAULT_STORY_COUNT) => {
  const [state, dispatch] = useReducer(storyListReducer, initialState);
  const { isLoading, isError, data: fetchedStoryListIds, refetch } = useQuery(
    ['storylist', apiQuery],
    () => getStoryListData(apiQuery, storyCount),
    reactQueryParams
  );

  useEffect(() => {
    if (fetchedStoryListIds) {
      dispatch({
        type: ACTION.INITIALIZE_LIST,
        storyListIds: fetchedStoryListIds.slice(0, storyCount),
      });
    }
  }, [fetchedStoryListIds]);

  useEffect(() => {
    if (fetchedStoryListIds) {
      dispatch({
        type: ACTION.UPDATE_LIST,
        storyListIds: fetchedStoryListIds.slice(0, storyCount * state.currentPage),
      });
      if ((storyCount * state.currentPage) >= fetchedStoryListIds.length) {
        dispatch({ type: ACTION.TOGGLE_PAGE_END });
      }
    }
  }, [fetchedStoryListIds, state.currentPage]);

  const listNextPage = () => dispatch({ type: ACTION.INCREASE_PAGE });

  return { ...state, isLoading, isError, refetch, listNextPage }
}