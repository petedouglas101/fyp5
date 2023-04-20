import createDataContext from "./createDataContext";
import appApi from "../api/server";

const supportReducer = (state, action) => {
  switch (action.type) {
    case "fetch_volunteers":
      return action.payload;
    default:
      return state;
  }
};

const fetchAvailableVolunteers = (dispatch) => {
  return async () => {
    try {
      const response = await appApi.get("/volunteers");
      dispatch({ type: "fetch_volunteers", payload: response.data });
    } catch (err) {
      console.log(err);
      //Add error for no available volunteers
    }
  };
};

const sendPushNotification = (dispatch) => {
  return async (volunteerId) => {
    try {
      const response = await appApi.post("/pushNotification", {
        volunteerId,
      });
    } catch (err) {
      console.log(err);
    }
  };
};

const addVolunteerToUser = (dispatch) => {
  return async (volunteerId) => {
    try {
      const response = await appApi.post("/addVolunteerToUser", {
        volunteerId,
      });
    } catch (err) {
      console.log(err);
    }
  };
};

const removeVolunteerFromUser = (dispatch) => {
  return async (volunteerId) => {
    try {
      const response = await appApi.post("/removeVolunteerFromUser", {
        volunteerId,
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const { Context, Provider } = createDataContext(
  supportReducer,
  {
    fetchAvailableVolunteers,
    sendPushNotification,
    addVolunteerToUser,
    removeVolunteerFromUser,
  },
  { volunteers: [] }
);
