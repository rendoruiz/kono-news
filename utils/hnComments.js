import axios from "axios";

// https://hn.algolia.com/api
const ENDPOINT_PREFIX = 'https://hn.algolia.com/api/v1/items/';

export const getCommentData = async (storyId) => {
  const commentDataEndpoint = ENDPOINT_PREFIX + storyId;
  const response = await axios.get(commentDataEndpoint);
  return response.data;
}