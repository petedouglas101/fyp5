import { Button } from "@rneui/base";
import React, { useContext } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Context as SupportContext } from "../context/SupportContext";

const VolunteerScreen = () => {
  const { sendPushNotification } = useContext(SupportContext);
  const route = useRoute();
  const volunteer = route.params.item;

  console.log("Volunteer passed", volunteer);
  return (
    <View>
      <View>
        <Image source={{ uri: volunteer.imageUri }} />
        <Text>{volunteer.username}</Text>
        <Text>{volunteer.isOnline ? "Available" : "Unavilable"}</Text>
        <Text>previousInteractions</Text>
      </View>
      <View>
        <Button
          title="Chat"
          onPress={() => {
            sendPushNotification(volunteer._id);
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default VolunteerScreen;
