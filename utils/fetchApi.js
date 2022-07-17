import axios from "axios";
import { STORIES_PER_PAGE, STORY_MODE, STORY_MODE_API_QUERY } from "./constants";

const HN_API_ENDPOINT = 'https://hacker-news.firebaseio.com/v0/'
const getStoryListIdsEndpoint = (storyListMode) => `${HN_API_ENDPOINT}${storyListMode}.json`;
const getStoryDataEndpoint = (storyId) => `${HN_API_ENDPOINT}item/${storyId}.json`;

const ALGOLIA_API_ENDPOINT = 'https://hn.algolia.com/api/v1/';
const getStoryCommentsDataEndpoint = (commentDataId) =>`${ALGOLIA_API_ENDPOINT}items/${commentDataId}`;

export const parseStoryListModeId = (modeString) => {
  if (!modeString) {
    return STORY_MODE.TOP;
  }

  const parsedStoryMode = STORY_MODE[modeString.toUpperCase()];
  return parsedStoryMode ? parsedStoryMode : STORY_MODE.TOP;
}

// returns: [...int]
export const getStoryListIds = async (listMode, isListModeParsed = false) => {
  const storyListId = isListModeParsed ? listMode : parseStoryListModeId(listMode);
  const storyListModeApi = STORY_MODE_API_QUERY.filter((mode) => mode.id === storyListId).pop();
  const endpoint = getStoryListIdsEndpoint(storyListModeApi.apiQuery);
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

export const getInitialStoryListData = async (listMode, isListModeParsed) => {
  try {
    const storyListIds = await getStoryListIds(listMode, isListModeParsed);
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
