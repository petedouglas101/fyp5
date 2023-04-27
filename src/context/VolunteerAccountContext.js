import createDataContext from "./createDataContext";
import appApi from "../api/server";

const volunteerAccountReducer = (state, action) => {
  switch (action.type) {
  }
};

const uploadProfilePicture = (dispatch) => {
  return async (imageBase64) => {
    try {
      const response = await appApi.post("/uploadProfilePicture", {
        imageBase64,
      });
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };
};

export const { Context, Provider } = createDataContext(
  volunteerAccountReducer,
  { uploadProfilePicture },
  { profilePicture: null }
);
