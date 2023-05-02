import React, { useContext } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import { ListItem } from "@rneui/themed";
import { Context as SupportContext } from "../context/SupportContext";
import * as RootNavigation from "../navigationRef";
import Icon from "react-native-vector-icons/FontAwesome";

const SupportScreen = ({ navigation }) => {
  const { state, fetchAvailableVolunteers } = useContext(SupportContext);

  navigation.addListener("focus", () => {
    fetchAvailableVolunteers();
  });

  return (
    <View style={styles.root}>
      {state.length > 0 ? (
        <View style={styles.overall}>
          <Text style={styles.headline}>Available Volunteers</Text>
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
                      <ListItem.Subtitle
                        style={[
                          styles.subtitle,
                          item.isOnline ? { color: "green" } : { color: "red" },
                        ]}
                      >
                        {item.isOnline ? "Available" : "Unavailable"}
                      </ListItem.Subtitle>
                    </ListItem.Content>
                    {item.isPreviousVolunteer && (
                      <Icon name="star" size={20} color="#6699CC" />
                    )}
                    <ListItem.Chevron />
                  </ListItem>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      ) : (
        <Text style={styles.headline}>No Volunteers Available</Text>
      )}
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
    fontSize: 14,
    marginTop: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  listItem: {
    borderBottomColor: "#cccccc",
    borderBottomWidth: 1,
  },
  headline: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 10,
    color: "#cccccc",
  },
  overall: {
    flex: 1,
    backgroundColor: "#5A5A5A",
    marginTop: 30,
  },
});

export default SupportScreen;
