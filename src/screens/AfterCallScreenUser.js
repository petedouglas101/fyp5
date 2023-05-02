import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { Button } from "@rneui/themed";
import { Context as SupportContext } from "../context/SupportContext";
import * as RootNavigation from "../navigationRef";

const AfterCallScreenUser = () => {
  const { state, addNotesToCall } = useContext(SupportContext);
  const [notes, setNotes] = useState("");
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leave some notes on the call:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          autoFocus={true}
          placeholder="Any positive takeaways from this call?"
          placeholderTextColor={"D3D3D3"}
          onChangeText={(text) => setNotes(text)}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          style={styles.submitButton}
          title="Submit"
          onPress={() => {
            addNotesToCall(state.call._id, notes);
          }}
        />
        <Button
          style={styles.submitButton}
          title="Back to Home"
          onPress={() => {
            RootNavigation.navigate("MainFlowTabs");
          }}
        />
      </View>
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
  title: {
    fontSize: 20,
    color: "#D3D3D3",
    fontWeight: "bold",
  },
  inputContainer: {
    marginTop: 20,
    width: 300,
    height: 200,
    borderColor: "#D3D3D3",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: "#D3D3D3",
    borderRadius: 10,
    width: 100,
    height: 50,
  },
});

export default AfterCallScreenUser;
