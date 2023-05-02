import { Button } from "@rneui/base";
import React, { useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { Context as SupportContext } from "../context/SupportContext";
import * as RootNavigation from "../navigationRef";
import { ListItem } from "@rneui/themed";

const VolunteerScreen = () => {
  const {
    sendPushNotification,
    addVolunteerToUser,
    removeVolunteerFromUser,
    addCallToDb,
    retrieveCalls,
    state,
  } = useContext(SupportContext);
  const route = useRoute();
  const volunteer = route.params.item;
  useEffect(() => {
    retrieveCalls(volunteer._id);
  }, []);
  let formattedCalls = [];
  if (state.calls) {
    formattedCalls = state.calls.map((call) => {
      const date = new Date(call.date);
      const formattedDate = date.toLocaleDateString("en-US", {
        weekday: "long",

        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
      });
      return { ...call, date: formattedDate, time: formattedTime };
    });
  }

  return (
    <View style={styles.root}>
      <View style={styles.volunteerInfo}>
        <Image source={{ uri: volunteer.imageUri }} />
        <Text style={styles.volunteerInfoText}>
          Username: {volunteer.username}
        </Text>
        <Text style={styles.volunteerInfoText}>
          Availability: {volunteer.isOnline ? "Available" : "Unavilable"}
        </Text>
      </View>
      {formattedCalls.length > 0 ? (
        <View>
          <Text style={styles.headline}>
            Previous Calls with: {volunteer.username}
          </Text>
          <FlatList
            data={formattedCalls}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    RootNavigation.navigate("CallDetails", { call: item })
                  }
                >
                  <ListItem style={styles.listItem}>
                    <ListItem.Content>
                      <ListItem.Title style={styles.title}>
                        {item.volunteer.username}
                      </ListItem.Title>
                      <ListItem.Subtitle style={styles.subtitle}>
                        {item.date} at {item.time}
                      </ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron />
                  </ListItem>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      ) : (
        <Text style={styles.headline}>
          No Previous Calls with: {volunteer.username}
        </Text>
      )}

      <View>
        <Button
          title="Request Support"
          onPress={() => {
            sendPushNotification(volunteer._id);
            RootNavigation.navigate("VideoCall");
            addVolunteerToUser(volunteer._id);
            addCallToDb(volunteer._id);
          }}
        />
      </View>
      <View>
        <Button
          title="Remove Volunteer from Favorites"
          onPress={() => {
            removeVolunteerFromUser(volunteer._id);
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  volunteerInfo: {
    flex: 1,
    alignItems: "center",
    marginTop: 15,
  },
  volunteerInfoText: {
    color: "#D3D3D3",
    fontSize: 15,
    marginBottom: 10,
    fontWeight: "bold",
  },
  listItem: {
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 12,
  },
  headline: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#D3D3D3",
  },
});

export default VolunteerScreen;
