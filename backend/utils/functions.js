import { variables } from "../config/db.js";
export const getUserFollowingData = async (user, pagination_token = null) => {
  let url = `https://corsanywhere.herokuapp.com/https://api.twitter.com/2/users/${user}/following`;
  if (pagination_token) {
    url += `&pagination_token=${pagination_token}`;
  }
  const { data } = await axios({
    url: url,
    method: "GET",
    headers: {
      Authorization: `Bearer ${variables.BEARER_TOKEN}`,
    },
  });
  return data;
};

export const getUserTweetsData = async (user, pagination_token = null) => {
  let url = `https://corsanywhere.herokuapp.com/https://api.twitter.com/2/users/${user}/tweets/?tweet.fields=entities,id,in_reply_to_user_id,referenced_tweets,text`;
  if (pagination_token) {
    url += `&pagination_token=${pagination_token}`;
  }
  const { data } = await axios({
    url: url,
    method: "GET",
    headers: {
      Authorization: `Bearer ${variables.BEARER_TOKEN}`,
    },
  });
  return data;
};
