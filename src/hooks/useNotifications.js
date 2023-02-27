import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Alert } from "react-native";
import { Platform } from "react-native";
import Constants from "expo-constants";

export const useNotifications = () => {
  let token;
  const projectId = Constants.expoConfig.extra.eas.projectId;
  const registerForPushNotificationsAsync = async () => {
    console.log("registerForPushNotificationsAsync");
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        console.log("status", status);
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        console.log("Error");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log("token", token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    return token;
  };

  return {
    registerForPushNotificationsAsync,
  };
};
