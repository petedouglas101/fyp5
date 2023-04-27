import createDataContext from "./createDataContext";
import appApi from "../api/server";

const supportReducer = (state, action) => {
  switch (action.type) {
    case "fetch_volunteers":
      return action.payload;
    case "add_call":
      return { ...state, call: action.payload };
    case "get_calls":
      return { ...state, calls: action.payload };
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

const addCallToDb = (dispatch) => {
  return async (volunteerId) => {
    try {
      const response = await appApi.post("/addCallToDb", {
        volunteerId,
      });
      dispatch({ type: "add_call", payload: response.data.call });
    } catch (err) {
      console.log(err);
    }
  };
};

const addNotesToCall = (dispatch) => {
  return async (callId, notes) => {
    try {
      const response = await appApi.post("/addNotesToCall", {
        callId,
        notes,
      });
    } catch (err) {
      console.log(err);
    }
  };
};

const retrieveCalls = (dispatch) => {
  return async (volunteerId) => {
    console.log("volunteerId: ", volunteerId);
    try {
      const response = await appApi.post("/retrieveCalls", {
        volunteerId: volunteerId,
      });
      console.log("response.data: ", response.data);
      dispatch({ type: "get_calls", payload: response.data });
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
    addCallToDb,
    addNotesToCall,
    retrieveCalls,
  },
  { volunteers: [], calls: [] }
);
