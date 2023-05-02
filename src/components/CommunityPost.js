import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as RootNavigation from "../navigationRef";

const CommunityPost = ({ user, date, post, comments, id }) => {
  const formatDate = (date) => {
    const newDate = new Date(date);
    const month = newDate.toLocaleString("default", { month: "short" });
    const day = newDate.getDate();
    const year = newDate.getFullYear();
    return `${day} ${month} ${year}`;
  };
  return (
    <View style={styles.container}>
      <Text style={styles.usernameText}>{user}</Text>
      <Text style={styles.dateText}>{formatDate(date)}</Text>
      <Text style={styles.postText}>{post}</Text>
      <TouchableOpacity
        style={styles.viewComments}
        onPress={() => {
          RootNavigation.navigate("CommentsScreen", { comments, post, id });
        }}
      >
        <Text style={styles.commentsBtn}>View Comments</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingBottom: 10,
    borderBottomColor: "#cccccc",
    borderBottomWidth: 1,
  },
  viewComments: {
    backgroundColor: "#6699CC",
    padding: 5,
    borderRadius: 5,
    alignSelf: "flex-end",
  },
  usernameText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  dateText: {
    color: "#666666",
  },
  postText: {
    paddingTop: 5,
  },
  commentsBtn: {
    color: "#ffffff",
  },
});

export default CommunityPost;
