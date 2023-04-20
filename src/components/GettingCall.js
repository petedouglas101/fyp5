import React from "react";
import { View, Text, StyleSheet } from "react-native";
import CallButton from "./CallButton";

const GettingCall = ({ hangup, join }) => {
  return (
    //might not need two views
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <CallButton
          iconName="phone"
          backgroundColor="green"
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
