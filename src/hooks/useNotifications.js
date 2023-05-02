import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import Constants from "expo-constants";
import { navigationRef } from "../navigationRef";

export const useNotifications = () => {
  const RootNavigation = navigationRef;

  let token;
  const projectId = Constants.expoConfig.extra.eas.projectId;
  const registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      console.log("Error");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    return token;
  };

  Notifications.addNotificationResponseReceivedListener((response) => {
    RootNavigation.navigate("VideoCall");
  });

  Notifications.addNotificationReceivedListener((notification) => {});

  return {
    registerForPushNotificationsAsync,
  };
};
