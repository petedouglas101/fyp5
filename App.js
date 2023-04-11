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
import SupportScreen from "./src/screens/SupportScreen";
import TrackerScreen from "./src/screens/TrackerScreen";
import VideoCallScreen from "./src/screens/VideoCallScreen";
import VolunteerScreen from "./src/screens/VolunteerScreen";
import { Provider as AuthProvider } from "./src/context/AuthContext";
import { Provider as CommunityProvider } from "./src/context/CommunityContext";
import { Provider as SupportProvider } from "./src/context/SupportContext";
import { navigationRef } from "./src/navigationRef";
import Icon from "react-native-vector-icons/FontAwesome5";

const AuthStack = createNativeStackNavigator();
const MainFlowTabsNav = createBottomTabNavigator();

const RootNavigation = navigationRef;

const MainFlowTabs = () => {
  return (
    <MainFlowTabsNav.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Community") {
            iconName = "users";
          } else if (route.name === "Support") {
            iconName = "handshake";
          } else if (route.name === "Tracker") {
            iconName = "heartbeat";
          } else if (route.name === "Account") {
            iconName = "user";
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#6699CC",
        tabBarInactiveTintColor: "#D3D3D3",
        tabBarStyle: {
          backgroundColor: "#36454F",
        },
        headerShown: false,
      })}
    >
      <MainFlowTabsNav.Screen
        name="Community"
        component={CommunityScreen}
        options={{ headerShown: false }}
      />
      <MainFlowTabsNav.Screen
        name="Support"
        component={SupportScreen}
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
        //Maybe call handleNotificationResponse from useNotifications hook here
        //Can extract data from notification here
      }
    );

    //Called when a notification is interacted with
    const subscription2 = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        //Bring user to the correct screen
        RootNavigation.navigate("VideoCall");
      }
    );

    return () => {
      subscription.remove();
      subscription2.remove();
    };
  }, []);

  return (
    <SupportProvider>
      <CommunityProvider>
        <AuthProvider>
          <NavigationContainer ref={navigationRef}>
            <AuthStack.Navigator
              screenOptions={{
                headerStyle: { backgroundColor: "#6699CC" },
                contentStyle: { backgroundColor: "#5A5A5A" },
                headerTintColor: "#36454F",
              }}
            >
              <AuthStack.Screen name="Signup" component={SignupScreen} />
              <AuthStack.Screen name="Signin" component={SigninScreen} />
              <AuthStack.Screen
                name="MainFlowTabs"
                component={MainFlowTabs}
                options={{ headerShown: false }}
              />
              <AuthStack.Screen name="Volunteer" component={VolunteerScreen} />
              <AuthStack.Screen name="VideoCall" component={VideoCallScreen} />
            </AuthStack.Navigator>
          </NavigationContainer>
        </AuthProvider>
      </CommunityProvider>
    </SupportProvider>
  );
}
