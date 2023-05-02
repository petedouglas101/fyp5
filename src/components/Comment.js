import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

const Comment = ({ date, comment, user }) => {
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
      <Text style={styles.postText}>{comment}</Text>
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
  usernameText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  dateText: {
    color: "#D3D3D3",
  },
  postText: {
    paddingTop: 5,
    color: "#ffffff",
  },
});

export default Comment;
