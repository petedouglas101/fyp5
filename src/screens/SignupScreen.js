import React, { useContext, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ButtonGroup, Text } from "@rneui/themed";
import { Context as AuthContext } from "../context/AuthContext";
import AuthForm from "../components/AuthForm";

const SignupScreen = ({ navigation }) => {
  const { state, signup } = useContext(AuthContext);

  navigation.addListener("blur", () => {
    clearErrorMessage();
  });

  return (
    <View style={styles.container}>
      <AuthForm
        headerText="Sign Up for iSober"
        errorMessage={state.errorMessage}
        submitButtonText="Sign Up"
        onSubmit={signup}
        SignupScreen={true}
      />
      <TouchableOpacity onPress={() => navigation.navigate("Signin")}>
        <Text style={styles.link}>Already have an account? Sign in here</Text>
      </TouchableOpacity>
    </View>
  );
};

SignupScreen.navigationOptions = {
  headerShown: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 200,
  },
  link: {
    color: "blue",
    marginLeft: 15,
    marginTop: 15,
  },
});

export default SignupScreen;
