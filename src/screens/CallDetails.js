import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";

const CallDetails = () => {
  const route = useRoute();
  const call = route.params.call;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notes from Call:</Text>
      <View style={styles.notes}>
        <Text style={styles.notesText}>{call.userNotes}</Text>
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
  header: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
    color: "#D3D3D3",
    fontWeight: "bold",
  },
  notes: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c3e50",
  },
  notesText: {
    fontSize: 15,
    textAlign: "center",
    margin: 10,
    color: "#D3D3D3",
    fontWeight: "bold",
  },
});

export default CallDetails;
