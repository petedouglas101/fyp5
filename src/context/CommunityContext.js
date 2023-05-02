import createDataContext from "./createDataContext";
import appApi from "../api/server";

const communityReducer = (state, action) => {
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
    const response = await appApi.get("/communityposts");
    dispatch({ type: "fetch_posts", payload: response.data });
  };
};

const createPost = (dispatch) => {
  return async ({ content }) => {
    try {
      const response = await appApi.post("/postToCommunity", { content });
      dispatch({ type: "create_post", payload: response.data });
    } catch (error) {}
  };
};

const addComment = (dispatch) => {
  return async ({ comment, id }) => {
    try {
      const response = await appApi.post("/addComment", { comment, id });
      dispatch({ type: "add_comment", payload: response.data });
    } catch (error) {}
  };
};

const fetchComments = (dispatch) => {
  return async (id) => {
    try {
      const response = await appApi.get(`/fetchComments/${id}`);
      dispatch({ type: "fetch_comments", payload: response.data });
    } catch (error) {}
  };
};

export const { Context, Provider } = createDataContext(
  communityReducer,
  { fetchPosts, createPost, addComment, fetchComments },
  []
);
