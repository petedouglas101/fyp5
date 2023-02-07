import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNotifications } from "./src/hooks/useNotifications";
import * as Notifications from "expo-notifications";
import SignupScreen from "./src/screens/SignupScreen";
import SigninScreen from "./src/screens/SigninScreen";
import AccountScreen from "./src/screens/AccountScreen";
import CommunityFeed from "./src/screens/CommunityFeed";
import ConnectScreen from "./src/screens/ConnectScreen";
import TrackerScreen from "./src/screens/TrackerScreen";
import VideoCallScreen from "./src/screens/VideoCallScreen";
import { Provider as AuthProvider } from "./src/context/AuthContext";
import { Provider as CommunityFeedProvider } from "./src/context/CommunityFeedContext";
import { Provider as ConnectProvider } from "./src/context/ConnectContext";
import { navigationRef } from "./src/navigationRef";

const AuthStack = createNativeStackNavigator();
const MainFlowTabsNav = createBottomTabNavigator();

// function MainFlowTabs() {
//   return (
//     <MainFlowTabsNav.Navigator>
//       <MainFlowTabs.Screen name="CommunityFeed" component={CommunityFeed} />
//       <MainFlowTabs.Screen name="Connect" component={ConnectScreen} />
//       <MainFlowTabs.Screen name="Tracker" component={TrackerScreen} />
//       <MainFlowTabs.Screen name="Account" component={AccountScreen} />
//     </MainFlowTabsNav.Navigator>
//   );
// }

const MainFlowTabs = () => {
  return (
    <MainFlowTabsNav.Navigator>
      <MainFlowTabsNav.Screen name="CommunityFeed" component={CommunityFeed} />
      <MainFlowTabsNav.Screen name="Connect" component={ConnectScreen} />
      <MainFlowTabsNav.Screen name="Tracker" component={TrackerScreen} />
      <MainFlowTabsNav.Screen name="Account" component={AccountScreen} />
      <MainFlowTabsNav.Screen name="VideoCall" component={VideoCallScreen} />
    </MainFlowTabsNav.Navigator>
  );
};

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldSetBadge: true,
      shouldPlaySound: true,
    };
  },
});

export default function App() {
  const { registerForPushNotificationsAsync } = useNotifications();

  useEffect(() => {
    registerForPushNotificationsAsync();
    //Maybe this should be in the useNotifications hook and not in useEffect and maybe this should be called outside of the App component
    // Notifications.setNotificationHandler({
    //   handleNotification: async () => {
    //     return {
    //       shouldShowAlert: true,
    //       shouldSetBadge: true,
    //       shouldPlaySound: true,
    //     };
    //   },
    // });

    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        //This only listens to notifications received when app is in foreground, not if they are interacted with
        console.log("Notification received in App.js", notification);
        //Maybe call handleNotificationResponse from useNotifications hook here
        //Can extract data from notification here
      }
    );

    //Called when a notification is interacted with
    const subscription2 = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("Notification response received in App.js", response);
        //Bring user to the correct screen
      }
    );

    return () => {
      subscription.remove();
      subscription2.remove();
    };
  }, []);

  return (
    <ConnectProvider>
      <CommunityFeedProvider>
        <AuthProvider>
          <NavigationContainer ref={navigationRef}>
            <AuthStack.Navigator>
              <AuthStack.Screen name="Signup" component={SignupScreen} />
              <AuthStack.Screen name="Signin" component={SigninScreen} />
              <AuthStack.Screen name="MainFlowTabs" component={MainFlowTabs} />
            </AuthStack.Navigator>
          </NavigationContainer>
        </AuthProvider>
      </CommunityFeedProvider>
    </ConnectProvider>
  );
}
