import axios from "axios";
import { STORIES_PER_PAGE, STORYMODE } from "./constants";

const HN_API_ENDPOINT = 'https://hacker-news.firebaseio.com/v0/'
const getStoryListIdsEndpoint = (storyListMode) => `${HN_API_ENDPOINT}${storyListMode}.json`;
const getStoryDataEndpoint = (storyId) => `${HN_API_ENDPOINT}item/${storyId}.json`;

const ALGOLIA_API_ENDPOINT = 'https://hn.algolia.com/api/v1/';
const getStoryCommentsDataEndpoint = (commentDataId) =>`${ALGOLIA_API_ENDPOINT}items/${commentDataId}`;

export const parseStoryListMode = (modeString) => {
  if (!modeString) {
    return STORYMODE.TOP;
  }

  const result = Object.keys(STORYMODE).filter((storyMode) => storyMode === modeString.toUpperCase()).pop();
  return result ? STORYMODE[result] : STORYMODE.TOP;
}

// returns: [...int]
export const getStoryListIds = async (modeString) => {
  const storyListMode = parseStoryListMode(modeString);
  const endpoint = getStoryListIdsEndpoint(storyListMode.apiQuery);
  try {
    const response = await axios.get(endpoint);
    return response.data;
  } catch {
    throw new Error('Failed to fetch story ids.');
  }
}

// returns: {...story}
export const getStoryData = async (storyId) => {
  if (!storyId) {
    return null;
  }

  const endpoint = getStoryDataEndpoint(storyId);
  try {
    const response = await axios.get(endpoint);
    return response.data;
  } catch {
    throw new Error('Failed to fetch story: ' + endpoint);
  }
}

// returns: {...storyComment}
export const getStoryCommentsData = async (storyCommentId) => {
  if (!storyCommentId) {
    return null;
  }

  const storyEndpoint = getStoryDataEndpoint(storyCommentId);
  const commentEndpoint = getStoryCommentsDataEndpoint(storyCommentId);
  try {
    const response = await Promise.all(
      [commentEndpoint, storyEndpoint].map((endpoint) => axios.get(endpoint))
    );
    return {
      ...response[0].data,
      post_count: response[1].data.descendants,
    };
  } catch {
    throw new Error('Failed to get story comment data id: ' + storyCommentId);
  }
}

export const getInitialStoryListData = async (storyType) => {
  try {
    const storyListIds = await getStoryListIds(storyType);
    const initialStoryListIds = storyListIds.slice(0, STORIES_PER_PAGE);
    const initialStoryListData = await Promise.all(
      initialStoryListIds.map((storyId) => getStoryData(storyId))
    );

    return [
      ...initialStoryListData,
      ...storyListIds.slice(STORIES_PER_PAGE).map((storyId) => {
        return {
          id: storyId,
          isDataEmpty: true,
        }
      }),
    ];
  } catch {
    throw new Error('Failed to fetch initial story list data.');
  }
  // const maxStoryPerPage = 30;
  // const storyIdList = await getStoryIdList(storyType);
  // const storyListData = await getStoryListData(storyIdList.slice(0, ));
  // return [storyIdList, storyListData];
}
