import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

const CallButton = ({ backgroundColor, onPress, iconName, style }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPress}
        style={[{ backgroundColor: backgroundColor }, style, styles.button]}
      >
        <Icon name={iconName} color="white" size={20} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    padding: 10,
    marginRight: 10,
    elevation: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },
});

export default CallButton;
