import createDataContext from "./createDataContext";
import appApi from "../api/server";

const communityFeedReducer = (state, action) => {
  switch (action.type) {
    case "fetch_posts":
      return action.payload;

    case "create_post":
      return [...state, action.payload];

    default:
      return state;
  }
};

const fetchPosts = (dispatch) => {
  return async () => {
    const response = await appApi.get("/blogposts");
    dispatch({ type: "fetch_posts", payload: response.data });
  };
};

const createPost = (dispatch) => {
  return async () => {
    try {
      const response = await appApi.post("/postblog");
      dispatch({ type: "create_post", payload: response.data });
    } catch (error) {}
  };
};

export const { Context, Provider } = createDataContext(
  communityFeedReducer,
  { fetchPosts, createPost },
  []
);
