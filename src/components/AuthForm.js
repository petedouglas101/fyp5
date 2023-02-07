import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Input, Button } from "@rneui/themed";
import { useNotifications } from "../hooks/useNotifications";

const AuthForm = ({
  headerText,
  errorMessage,
  onSubmit,
  submitButtonText,
  accountType,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [expoPushToken, setExpoPushToken] = useState("");

  const { registerForPushNotificationsAsync } = useNotifications();

  registerForPushNotificationsAsync().then((token) => setExpoPushToken(token));

  return (
    <>
      <Text h4>{headerText}</Text>

      <View style={styles.inputContainer}>
        <Input
          style={styles.input}
          label="Email"
          value={email}
          onChangeText={(newEmail) => setEmail(newEmail)}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          secureTextEntry
          label="Password"
          value={password}
          onChangeText={(newPassword) => setPassword(newPassword)}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      {errorMessage ? (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      ) : null}
      <View style={styles.buttonView}>
        <Button
          title={submitButtonText}
          onPress={() =>
            onSubmit({ email, password, accountType, expoPushToken })
          }
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1,
    borderColor: "d3d3d3",
    borderRadius: 5,
    margin: (10, 10, 0, 10),
  },
  buttonView: {
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: "red",
    marginLeft: 15,
    marginBottom: 15,
  },
});

export default AuthForm;
