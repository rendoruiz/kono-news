import axios from "axios";
import { STORIES_PER_PAGE, STORY_MODE, STORY_MODE_API_QUERY } from "./constants";

const HN_API_ENDPOINT = 'https://hacker-news.firebaseio.com/v0/'
const getStoryListIdsEndpoint = (storyListMode) => `${HN_API_ENDPOINT}${storyListMode}.json`;
const getStoryDataEndpoint = (storyId) => `${HN_API_ENDPOINT}item/${storyId}.json`;

const ALGOLIA_API_ENDPOINT = 'https://hn.algolia.com/api/v1/';
const getStoryCommentsDataEndpoint = (commentDataId) =>`${ALGOLIA_API_ENDPOINT}items/${commentDataId}`;

const getServerErrorMessage = (serverEndpoint) => `Failed to fetch resource: ${serverEndpoint}`;

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
    throw new Error(getServerErrorMessage(endpoint));
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
    throw new Error(getServerErrorMessage(endpoint));
  }
}

// returns: {...storyComment}
export const getStoryCommentsData = async (storyCommentId) => {
  if (!storyCommentId) {
    return null;
  }

  let commentData = null;
  const commentEndpoint = getStoryCommentsDataEndpoint(storyCommentId);
  try {
    const response = await axios.get(commentEndpoint);
    commentData = response.data;
  } catch {
    throw new Error(getServerErrorMessage(commentEndpoint));
  }
  
  let storyData = null;
  const storyEndpoint = getStoryDataEndpoint(commentData.story_id ? commentData.story_id : storyCommentId);
  try {
    const response = await axios.get(storyEndpoint);
    storyData = response.data;
  } catch {
    throw new Error(getServerErrorMessage(storyEndpoint));
  }

  return {
    ...commentData,
    post_count: storyData.descendants
  }
}

// returns: [...{storyData}]
// the number of fetched full story data is based on STORIES_PER_PAGE
export const getInitialStoryListData = async (listMode, isListModeParsed) => {
  try {
    const storyListIds = await getStoryListIds(listMode, isListModeParsed);
    const initialStoryListIds = storyListIds.slice(0, STORIES_PER_PAGE);
    let initialStoryListData = await Promise.all(
      initialStoryListIds.map((storyId) => getStoryData(storyId))
    );
    initialStoryListData = initialStoryListData.filter((data) => data);

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
}
