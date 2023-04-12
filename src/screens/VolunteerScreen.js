import { Button } from "@rneui/base";
import React, { useContext } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Context as SupportContext } from "../context/SupportContext";
import * as RootNavigation from "../navigationRef";

const VolunteerScreen = () => {
  const { sendPushNotification, addVolunteerToUser, removeVolunteerFromUser } =
    useContext(SupportContext);
  const route = useRoute();
  const volunteer = route.params.item;
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
            RootNavigation.navigate("VideoCall");
            addVolunteerToUser(volunteer._id);
          }}
        />
        <Button
          title="Remove Volunteer"
          onPress={() => {
            removeVolunteerFromUser(volunteer._id);
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default VolunteerScreen;
