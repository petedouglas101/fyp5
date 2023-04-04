import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

//each post has name of user, date, post, and comments

const CommunityPost = ({ user, date, post, comments }) => {
  //function for changing date format to dd/Aug/yy
  const formatDate = (date) => {
    const newDate = new Date(date);
    const month = newDate.toLocaleString("default", { month: "short" });
    const day = newDate.getDate();
    const year = newDate.getFullYear();
    return `${day} ${month} ${year}`;
  };
  return (
    <View style={styles.container}>
      <Text>{user}</Text>
      <Text>{formatDate(date)}</Text>
      <Text>{post}</Text>
      <Text>{comments}</Text>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingBottom: 10,
    borderBottomColor: "",
    borderBottomWidth: 1,
  },
});

export default CommunityPost;
