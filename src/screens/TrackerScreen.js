import React, { useRef } from "react";
import { View, StyleSheet, Button } from "react-native";
import Timer from "react-native-background-timer-android";

const TrackerScreen = () => {
  const startTrackingRef = useRef(null);

  const startTracking = () => {
    startTrackingRef.current = Timer.setInterval(
      () => console.log("tic"),
      2000
    );
  };

  const stopTracking = () => {
    Timer.clearInterval(startTrackingRef.current);
    console.log("stopped");
  };

  return (
    <View style={styles.root}>
      <Button
        title="Start Tracking"
        buttonStyle={styles.button}
        onPress={startTracking}
      />
      <Button
        title="Stop Tracking"
        buttonStyle={styles.button}
        onPress={stopTracking}
      />
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
