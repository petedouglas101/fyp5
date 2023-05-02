import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { launchCameraAsync } from "expo-image-picker";
import { Context as VolunteerAccountContext } from "../context/VolunteerAccountContext";

const ImagePicker = () => {
  const { uploadProfilePicture } = useContext(VolunteerAccountContext);
  const [image, setImage] = useState(null);

  async function takeImageHandler() {
    const image = await launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
      cameraType: "front",
      base64: true,
    });
    setImage(image.assets[0].uri);
    uploadProfilePicture(image.assets[0].base64);
  }

  return (
    <View style={styles.container}>
      <View></View>
      <Button title="Take Image" onPress={takeImageHandler} />
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
});

export default ImagePicker;
