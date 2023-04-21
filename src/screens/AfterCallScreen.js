import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import { useRoute } from "@react-navigation/native";

const AfterCallScreen = () => {
  const route = useRoute();
  const volunteer = route.params.volunteerDetails;
  return (
    <View style={styles.container}>
      <Text>Call with : {volunteer.username}</Text>
      <View>
        <Text>Notes:</Text>
        <TextInput
          style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        />
      </View>
      <Button title="Submit" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c3e50",
  },
});

export default AfterCallScreen;
