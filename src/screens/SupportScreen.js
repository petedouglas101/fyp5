import React, { useContext, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Button, ListItem } from "@rneui/themed";
import { Context as SupportContext } from "../context/SupportContext";
import * as RootNavigation from "../navigationRef";

const ConnectScreen = () => {
  const [selectedVolunteer, setSelectedVolunteer] = useState({ _id: "" });
  const { state, fetchAvailableVolunteers, sendPushNotification } =
    useContext(SupportContext);

  return (
    <View style={styles.root}>
      <Button
        title="Connect with a Volunteer"
        buttonStyle={styles.button}
        onPress={fetchAvailableVolunteers}
      />
      <View>
        <FlatList
          data={state}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setSelectedVolunteer(item._id),
                    sendPushNotification(selectedVolunteer),
                    RootNavigation.navigate("VideoCall");
                }}
              >
                <ListItem>
                  <ListItem.Content>
                    <ListItem.Title>{item.username}</ListItem.Title>
                  </ListItem.Content>
                  <ListItem.Chevron />
                </ListItem>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    borderRadius: 5,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#5A5A5A",
  },

  button: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: "#6699CC",
    alignSelf: "center",
    elevation: 5,
  },
});

export default ConnectScreen;
