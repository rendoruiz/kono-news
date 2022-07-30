import axios from "axios";
import { getStringCount } from ".";
import { STORIES_PER_PAGE, STORY_MODE, STORY_MODE_API_QUERY } from "./constants";

const HN_API_ENDPOINT = 'https://hacker-news.firebaseio.com/v0/'
const getStoryListIdsEndpoint = (storyListMode) => `${HN_API_ENDPOINT}${storyListMode}.json`;
const getStoryDataEndpoint = (storyId) => `${HN_API_ENDPOINT}item/${storyId}.json`;

const ALGOLIA_API_ENDPOINT = 'https://hn.algolia.com/api/v1/';
const getStoryDiscussionDataEndpoint = (commentDataId) =>`${ALGOLIA_API_ENDPOINT}items/${commentDataId}`;

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
export const getStoryDiscussionData = async (storyCommentId) => {
  if (!storyCommentId) {
    return null;
  }

  let commentData = null;
  const commentEndpoint = getStoryDiscussionDataEndpoint(storyCommentId);
  try {
    const response = await axios.get(commentEndpoint);
    commentData = response.data;
  } catch {
    throw new Error(getServerErrorMessage(commentEndpoint));
  }
  
  let storyData;
  if (commentData.story_id) {
    const storyEndpoint = getStoryDiscussionDataEndpoint(commentData.story_id);
    try {
      const response = await axios.get(storyEndpoint);
      storyData = response.data;
    } catch {
      throw new Error(getServerErrorMessage(storyEndpoint));
    }
    const commentCount = getStringCount(storyData.children, '"title":null');
    const deadCommentCount = getStringCount(storyData.children, '"text":null');

    console.log({
      ...storyData,
      children: [{...commentData}],
      post_count: commentCount - deadCommentCount,
      permalink: true,
    })
    return {
      ...storyData,
      children: [{...commentData}],
      post_count: commentCount - deadCommentCount,
      permalink: true,
    }
  } else {
    const commentCount = getStringCount(commentData.children, '"title":null');
    const deadCommentCount = getStringCount(commentData.children, '"text":null');
    return {
      ...commentData,
      post_count: commentCount - deadCommentCount,
    }
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
