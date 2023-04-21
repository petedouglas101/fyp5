import React, { useContext, useState } from "react";
import { View, StyleSheet, Text, Switch } from "react-native";
import { Button } from "@rneui/themed";
import { Context as AuthContext } from "../context/AuthContext";

const VolunteerAccountScreen = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const { signout, getStatus, status } = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account</Text>
      <View style={{ flexDirection: "row" }}>
        <Text>Set Status:</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
          onValueChange={() => {
            setIsEnabled(!isEnabled);
            if (isEnabled) {
              setIsOnline(true);
            } else {
              setIsOnline(false);
            }
          }}
          value={isEnabled}
        />
      </View>
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
