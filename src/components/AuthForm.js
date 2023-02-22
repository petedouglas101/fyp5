import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Input, Button, ButtonGroup } from "@rneui/themed";
import { useNotifications } from "../hooks/useNotifications";

const AuthForm = ({
  headerText,
  errorMessage,
  onSubmit,
  submitButtonText,
  SignupScreen,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [expoPushToken, setExpoPushToken] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const accountType = selectedIndex === 0 ? "User" : "Volunteer";

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
          style={styles.input}
          label="Username"
          value={username}
          onChangeText={(newUsername) => setUsername(newUsername)}
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
      {SignupScreen ? (
        <ButtonGroup
          buttons={["User", "Volunteer"]}
          selectedIndex={selectedIndex}
          onPress={(index) => setSelectedIndex(index)}
        />
      ) : null}
      <View style={styles.buttonView}>
        <Button
          title={submitButtonText}
          onPress={() =>
            onSubmit({ email, password, accountType, expoPushToken, username })
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
