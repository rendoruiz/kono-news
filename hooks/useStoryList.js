import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";

import { HN_API_ENDPOINT, reactQueryParams } from "../utils/constants";
import { throwAndLogError } from "../utils/functions";

const PAGE_STORY_COUNT = 25;

const getStoryListEndpoint = (apiQuery) =>
  HN_API_ENDPOINT + apiQuery + '.json';

const fetchStoryListIds = async (apiQuery) => {
  try {
    const response = await axios.get(getStoryListEndpoint(apiQuery));
    return {
      id: response.data.id,
      title: response.data.title,
      url: response.data?.url,
      author: response.data.by,
      points: response.data.score,
      post_count: response.data.descendants,
    };
  } catch {
    throwAndLogError('[fetchStoryListIds]: Failed to connect to server');
  }
}

const getStoryListPages = async (apiQuery, storyCount) => {
  const storyListIds = await fetchStoryListIds(apiQuery);
  const maxPageCount = Math.ceil(storyListIds.length / storyCount);
  const storyListPages = [];

  for (let page = 0; page < maxPageCount; page += 1) {
    const idIndex = page * storyCount;
    storyListPages.push({
      page: page+1,
      pageIds: storyListIds.slice(idIndex, idIndex + storyCount),
    });
  }

  return storyListPages;
}

export const useStoryList = (apiQuery, storyCount = PAGE_STORY_COUNT) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const [storyListPages, setStoryListPages] = useState(null);
  const { isLoading, isError, data: fetchedStoryListPages, refetch } = useQuery(
    ['storylist', apiQuery],
    () => getStoryListPages(apiQuery, storyCount),
    reactQueryParams
  );

  useEffect(() => {
    setCurrentPage(1);
    setIsLastPage(false);
    setStoryListPages(null);
  }, [fetchedStoryListPages]);

  useEffect(() => {
    if (fetchedStoryListPages) {
      setStoryListPages(fetchedStoryListPages.slice(0, currentPage));
      if (currentPage >= fetchedStoryListPages.length) {
        setIsLastPage(true);
      }
    }
  }, [fetchedStoryListPages, currentPage]);

  const loadNextPage = () => setCurrentPage((prevState) => prevState + 1);

  return { storyListPages, isLastPage, isLoading, isError, refetch, loadNextPage }
}