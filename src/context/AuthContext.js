import AsyncStorage from "@react-native-async-storage/async-storage";
import createDataContext from "./createDataContext";
import appApi from "../api/server";
import * as RootNavigation from "../navigationRef";

const authReducer = (state, action) => {
  switch (action.type) {
    case "add_error":
      return { ...state, errorMessage: action.payload };
    case "signin":
      return { errorMessage: "", token: action.payload };
    case "signout":
      return { token: null, errorMessage: "" };
    case "clear_error_message":
      return { ...state, errorMessage: "" };
    case "get_status":
      return { status: action.payload };
    default:
      return state;
  }
};

const tryLocalSignin = (dispatch) => {
  return async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      dispatch({ type: "signin", payload: token });
      RootNavigation.navigate("MainFlowTabs");
    } else {
      RootNavigation.navigate("Signin");
    }
  };
};

const clearErrorMessage = (dispatch) => {
  return () => {
    dispatch({ type: "clear_error_message" });
  };
};

const signup = (dispatch) => {
  return async ({ email, password, accountType, expoPushToken, username }) => {
    try {
      const response = await appApi.post("/signup", {
        email,
        password,
        accountType,
        expoPushToken,
        username,
      });
      await AsyncStorage.setItem("token", response.data.token);
      dispatch({ type: "signin", payload: response.data.token });
      if (response.data.accountType == "user") {
        RootNavigation.navigate("MainFlowTabs");
      } else {
        RootNavigation.navigate("VolunteerFlowTabs");
      }
    } catch (err) {
      dispatch({
        type: "add_error",
        payload: "Something went wrong with sign up",
      });
    }
  };
};

const signin = (dispatch) => {
  return async ({ email, password }) => {
    try {
      const response = await appApi.post("/signin", { email, password });
      await AsyncStorage.setItem("token", response.data.token);
      dispatch({ type: "signin", payload: response.data.token });

      if (response.data.accountType == "user") {
        RootNavigation.navigate("MainFlowTabs");
      } else {
        RootNavigation.navigate("VolunteerFlowTabs");
      }
    } catch (err) {
      dispatch({
        type: "add_error",
        payload: "Something went wrong with sign in",
      });
    }
  };
};

const signout = (dispatch) => {
  return async () => {
    await AsyncStorage.removeItem("token");
    dispatch({ type: "signout" });
    RootNavigation.navigate("Signup");
  };
};

const getStatus = (dispatch) => {
  return async () => {
    try {
      const response = await appApi.get("/getStatus");
      console.log("response from context", response.data);

      dispatch({ type: "get_status", payload: response.data });
      console.log("response from context", response.data);
    } catch (err) {
      console.log(err);
    }
  };
};

export const { Context, Provider } = createDataContext(
  authReducer,
  { signin, signup, signout, clearErrorMessage, tryLocalSignin, getStatus },
  { token: null, errorMessage: "", status: null }
);
