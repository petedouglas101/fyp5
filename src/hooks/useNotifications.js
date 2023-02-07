// import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Alert } from "react-native";
import { Platform } from "react-native";
import { navigate } from "../navigationRef";

export const useNotifications = () => {
  let token;
  const registerForPushNotificationsAsync = async () => {
    // if (Device.isDevice) {
    //   const { status: existingStatus } =
    //     await Notifications.getPermissionsAsync();
    //   let finalStatus = existingStatus;
    //   if (existingStatus !== "granted") {
    //     const { status } = await Notifications.requestPermissionsAsync();
    //     finalStatus = status;
    //   }
    //   if (finalStatus !== "granted") {
    //     alert("Failed to get push token for push notification!");
    //     return;
    //   }
    //   token = (await Notifications.getExpoPushTokenAsync()).data;
    // } else {
    //   alert("Must use physical device for Push Notifications");
    // }

    const { status } = await Notifications.requestPermissionsAsync();
    let finalStatus = status;
    if (finalStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert("Failed to get push token for push notification!");
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    return token;
  };

  // const handleNotification = (notification) => {
  //   this.setState({ notification: notification });
  // };

  // const handleNotificationResponse = (response) => {
  //   console.log("This is the notification", response);
  //   //navigate user tp the correct screen using navigationRef
  //   navigate("CommunityFeed");
  // };

  return {
    registerForPushNotificationsAsync,
    // handleNotification,
    // handleNotificationResponse,
  };
};
