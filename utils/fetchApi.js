import axios from "axios";
import { getStringCount } from ".";
import { STORIES_PER_PAGE, STORY_MODE, STORY_MODE_API_QUERY } from "./constants";

const HACKERNEWS_URL = 'https://news.ycombinator.com/';
const HACKERNEWS_ITEM_URL = 'https://news.ycombinator.com/item?id=';

const HN_API_ENDPOINT = 'https://hacker-news.firebaseio.com/v0/';
const getStoryListIdsEndpoint = (storyListMode) => `${HN_API_ENDPOINT}${storyListMode}.json`;
const getStoryDataEndpoint = (storyId) => `${HN_API_ENDPOINT}item/${storyId}.json`;

const ALGOLIA_API_ENDPOINT = 'https://hn.algolia.com/api/v1/';
const getStoryDiscussionDataEndpoint = (commentDataId) =>`${ALGOLIA_API_ENDPOINT}items/${commentDataId}`;

const getServerErrorMessage = (requestObject) => `Failed to fetch resource: ${requestObject}`;
const getServerErrorObject = (apiEndpoint, originalUrl) => ({
  cause: {
    apiEndpoint,
    originalUrl,
  }
});

export const parseStoryListModeId = (modeString) => {
  if (!modeString) {
    return STORY_MODE.TOP;
  }

  const parsedStoryMode = STORY_MODE[modeString];
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
    throw new Error(
      getServerErrorMessage('story list ids'), 
      getServerErrorObject(
        endpoint, 
        HACKERNEWS_URL,
      ),
    );
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
    throw new Error(
      getServerErrorMessage('story data'),
      getServerErrorObject(
        endpoint, 
        HACKERNEWS_ITEM_URL + storyId,
      ),
    );
  }
}

// returns: {...storyComment}
export const getStoryDiscussionData = async (storyDiscussionId) => {
  if (!storyDiscussionId) {
    return null;
  }

  let commentData = null;
  const commentEndpoint = getStoryDiscussionDataEndpoint(storyDiscussionId);
  try {
    const response = await axios.get(commentEndpoint);
    commentData = response.data;
  } catch {
    throw new Error(
      getServerErrorMessage('story discussion data'),
      getServerErrorObject(
        commentEndpoint,
        HACKERNEWS_ITEM_URL + storyDiscussionId,
      ),
    );
  }
  
  let storyData = null;
  const storyDiscussionParentId = commentData.story_id;
  if (storyDiscussionParentId) {
    const storyEndpoint = getStoryDiscussionDataEndpoint(storyDiscussionParentId);
    try {
      const response = await axios.get(storyEndpoint);
      storyData = response.data;
    } catch {
      throw new Error(
        getServerErrorMessage('story discussion parent data'),
        getServerErrorObject(
          storyEndpoint,
          HACKERNEWS_ITEM_URL + storyDiscussionParentId,
        ),
      );
    }
    
    const commentCount = getStringCount(storyData.children, '"title":null');
    const deadCommentCount = getStringCount(storyData.children, '"text":null');
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
  } catch (error) {
    throw error;
  }
}
