import axios from "axios";
import { ALGOLIA_ENDPOINT_PREFIX, HN_ENDPOINT_PREFIX } from "."

export const getUserData = async (userId) => {
  const userDataEndpoint = HN_ENDPOINT_PREFIX + `user/${userId}.json`;
  const response = await axios.get(userDataEndpoint);
  return response.data;
}

export const getUserContentData = async ({
  userId, 
  page = 0,
  type = 'story'
}) => {
  const userContentEndpoint = ALGOLIA_ENDPOINT_PREFIX + 
    `search_by_date?hitsPerPage=30&tags=${type},author_${userId}&page=${page}`;
  const response = await axios.get(userContentEndpoint);
  return response.data;
}

export const getInitialUserData = (userId) => {
  return Promise.all([
    getUserData(userId),
    getUserContentData({userId: userId}),
  ]);
}