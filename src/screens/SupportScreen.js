import React, { useContext, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Button, ListItem } from "@rneui/themed";
import { Context as SupportContext } from "../context/SupportContext";
import * as RootNavigation from "../navigationRef";
import { color } from "@rneui/base";

const SupportScreen = () => {
  const [selectedVolunteer, setSelectedVolunteer] = useState({ _id: "" });
  const { state, fetchAvailableVolunteers, sendPushNotification } =
    useContext(SupportContext);

  // //sorts volunteers by online status
  // function sortByOnline(a, b) {
  //   return b.isOnline - a.isOnline;
  // }

  // const sortedVolunteers = state.sort(sortByOnline);

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
                  RootNavigation.navigate("Volunteer", { item });
                }}
              >
                <ListItem style={styles.listItem}>
                  <ListItem.Content>
                    <ListItem.Title style={styles.title}>
                      {item.username}
                    </ListItem.Title>
                    <ListItem.Subtitle style={styles.subtitle}>
                      {item.isOnline ? "Available" : "Unavailable"}
                    </ListItem.Subtitle>
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
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 11,
    color: "red",
    marginTop: 3,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
  },
  listItem: {
    borderBottomColor: "#cccccc",
    borderBottomWidth: 1,
  },
});

export default SupportScreen;
