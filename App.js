import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNotifications } from "./src/hooks/useNotifications";
import * as Notifications from "expo-notifications";
import SignupScreen from "./src/screens/SignupScreen";
import SigninScreen from "./src/screens/SigninScreen";
import AccountScreen from "./src/screens/AccountScreen";
import CommunityScreen from "./src/screens/CommunityScreen";
import ConnectScreen from "./src/screens/ConnectScreen";
import TrackerScreen from "./src/screens/TrackerScreen";
import VideoCallScreen from "./src/screens/VideoCallScreen";
import { Provider as AuthProvider } from "./src/context/AuthContext";
import { Provider as CommunityProvider } from "./src/context/CommunityContext";
import { Provider as ConnectProvider } from "./src/context/ConnectContext";
import { navigationRef } from "./src/navigationRef";

const AuthStack = createNativeStackNavigator();
const MainFlowTabsNav = createBottomTabNavigator();

const MainFlowTabs = () => {
  return (
    <MainFlowTabsNav.Navigator>
      <MainFlowTabsNav.Screen
        name="Community"
        component={CommunityScreen}
        options={{ headerShown: false }}
      />
      <MainFlowTabsNav.Screen
        name="Connect"
        component={ConnectScreen}
        options={{ headerShown: false }}
      />
      <MainFlowTabsNav.Screen
        name="Tracker"
        component={TrackerScreen}
        options={{ headerShown: false }}
      />
      <MainFlowTabsNav.Screen
        name="Account"
        component={AccountScreen}
        options={{ headerShown: false }}
      />
      <MainFlowTabsNav.Screen
        name="VideoCall"
        component={VideoCallScreen}
        options={{ headerShown: false }}
      />
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
    console.log("App.js useEffect");
    registerForPushNotificationsAsync();
    Notifications.setNotificationHandler({
      handleNotification: async () => {
        return {
          shouldShowAlert: true,
          shouldSetBadge: true,
          shouldPlaySound: true,
        };
      },
    });

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
        RootNavigation.navigate("VideoCallScreen");
      }
    );

    return () => {
      subscription.remove();
      subscription2.remove();
    };
  }, []);

  return (
    <ConnectProvider>
      <CommunityProvider>
        <AuthProvider>
          <NavigationContainer ref={navigationRef}>
            <AuthStack.Navigator screenOptions={{ headerShown: false }}>
              <AuthStack.Screen name="Signup" component={SignupScreen} />
              <AuthStack.Screen name="Signin" component={SigninScreen} />
              <AuthStack.Screen name="MainFlowTabs" component={MainFlowTabs} />
            </AuthStack.Navigator>
          </NavigationContainer>
        </AuthProvider>
      </CommunityProvider>
    </ConnectProvider>
  );
}
