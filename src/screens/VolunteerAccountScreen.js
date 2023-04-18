import React, { useContext } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Button } from "@rneui/themed";
import { Context as AuthContext } from "../context/AuthContext";

const VolunteerAccountScreen = () => {
  const { signout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account</Text>
      <Button title="Sign Out" onPress={signout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 200,
  },
  title: {
    fontSize: 48,
    alignSelf: "center",
    marginBottom: 20,
  },
});

export default VolunteerAccountScreen;
