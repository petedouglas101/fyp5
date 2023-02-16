import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

//each post has name of user, date, post, and comments

const CommunityPost = ({ user, date, post, comments }) => {
  return (
    <View style={styles.container}>
      <Text>{user}</Text>
      <Text>{date}</Text>
      <Text>{post}</Text>
      <Text>{comments}</Text>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({});

export default CommunityPost;
