import React, { useEffect, useContext } from "react";
import { ActivityIndicator } from "react-native";
import { Context as AuthContext } from "../context/AuthContext";

const LoadingScreen = () => {
  const { tryLocalSignin } = useContext(AuthContext);

  useEffect(() => {
    tryLocalSignin();
  }, []);

  return;
};

export default LoadingScreen;
