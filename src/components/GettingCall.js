import React from "react";
import { View, Text, StyleSheet } from "react-native";
import CallButton from "./CallButton";

//This is the screen that will be shown when a user is getting a call
//Add some background image or something to make it look better
const GettingCall = ({ hangup, join }) => {
  return (
    //might not need two views
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <CallButton
          iconName="phone"
          backgroundColor="blue"
          onPress={join}
          style={{ marginRight: 30 }}
        />
        <CallButton
          iconName="phone"
          backgroundColor="red"
          onPress={hangup}
          style={{ marginLeft: 30 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    bottom: 30,
  },
});

export default GettingCall;
