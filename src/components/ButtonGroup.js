import React from "react";
import { View, StyleSheet } from "react-native";
import { ButtonGroup } from "react-native-elements";

const ButtonGroup = (buttonChoices) => {
  return (
    <View style={styles.viewContainer}>
      <ButtonGroup
        buttons={buttonChoices}
        containerStyle={styles.buttonGroup}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 200,
  },
  buttonGroup: {
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 5,
    margin: (10, 10, 0, 10),
  },
});

export default ButtonGroup;
