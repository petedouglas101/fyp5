import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";

const MultilineTextInput = () => {
  const [text, setText] = useState("");
  return (
    <TextInput
      style={styles.input}
      multiline={true}
      numberOfLines={4}
      value={text}
      onChangeText={(newText) => setText(newText)}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 5,
    margin: (10, 10, 0, 10),
  },
});

export default MultilineTextInput;
