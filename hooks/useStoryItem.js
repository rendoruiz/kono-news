import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getMiniTime } from "../utils";
import { QUERY_KEY, reactQueryParams } from "../utils/constants";
import { getStoryData } from "./useStoryList";

export const useStoryItem = (initialStoryData) => {
  const router = useRouter();
  const [storyData, setStoryData] = useState(null);
  const { isLoading, isError, data: fetchedStoryData, refetch } = useQuery(
    ['storyitem', initialStoryData],
    () => getStoryData(initialStoryData.id),
    { 
      ...reactQueryParams,
      initialData: !initialStoryData.loaded ? undefined : initialStoryData,
    }
  );

  const routeHrefQueryObject = {
    ...router.query,
    [QUERY_KEY.STORY_DISCUSSION_ID]: initialStoryData.id,
  }

  useEffect(() => {
    if (fetchedStoryData) {
      setStoryData({
        ...fetchedStoryData,
        time: getMiniTime(fetchedStoryData.time),
        permalinkHrefObject: { query: {
          ...routeHrefQueryObject,
          [QUERY_KEY.IS_PERMALINK]: true,
        }},
      });
    }
  }, [fetchedStoryData]);

  const openDiscussion = (e) => {
    e.preventDefault();
    router.push(
      { query: {
        ...routeHrefQueryObject,
        [QUERY_KEY.IS_STORY_DISCUSSION_EXPANDED]: true,
      }},
      undefined, 
      { shallow: true }
    );
    refetch();
  }

  return { storyData, isLoading, isError, openDiscussion }
}