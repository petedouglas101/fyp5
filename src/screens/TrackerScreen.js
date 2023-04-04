import React from "react";
import { View, StyleSheet, Text } from "react-native";

const TrackerScreen = () => {

    //On press of button, start tracking time
    function setTimeout(() => {
        
    }, timeout);{
        //set start time
        //set end time
        //set time difference
        //set time difference to state
    }
  return (
    <View style={styles.root}>
      <Button
        title="Start Tracking"
        buttonStyle={styles.button}
        onPress={fetchAvailableVolunteers}
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
