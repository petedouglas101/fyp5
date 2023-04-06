import React from "react";
import { View, StyleSheet, Button } from "react-native";
import Timer from "react-native-background-timer-android";
import { Platform } from "react-native";

const TrackerScreen = () => {
  // const timerInterval = 200; // 24 hours in milliseconds
  const startTracking = Timer.setInterval(() => console.log("tic"), 500);

  // Timer.clearInterval(startTracking);
  // console.log(Platform);

  return (
    <View style={styles.root}>
      <Button
        title="Start Tracking"
        buttonStyle={styles.button}
        onPress={startTracking}
      />
      <Button title="Start Tracking" buttonStyle={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    borderRadius: 5,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#5A5A5A",
  },

  button: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: "#6699CC",
    alignSelf: "center",
  },
});

export default TrackerScreen;
