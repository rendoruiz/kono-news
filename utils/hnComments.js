import axios from "axios";
import { ALGOLIA_ENDPOINT_PREFIX } from ".";

export const getCommentData = async (storyId) => {
  const commentDataEndpoint = ALGOLIA_ENDPOINT_PREFIX + `items/${storyId}`;
  const response = await axios.get(commentDataEndpoint);
  return response.data;
}