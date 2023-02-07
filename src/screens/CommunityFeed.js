import React, { useContext, useState } from "react";
import { View, StyleSheet, TextInput, Button, FlatList } from "react-native";
import { Text } from "@rneui/themed";
import { Context as CommunityFeedContext } from "../context/CommunityFeedContext";

const CommunityFeed = ({ navigation }) => {
  const [content, setContent] = useState("");
  const { state, createPost } = useContext(CommunityFeedContext);
  return (
    <View style={styles.viewContainer}>
      <Text h2>Community Feed</Text>
      <TextInput
        style={styles.input}
        multiline={true}
        numberOfLines={4}
        value={content}
        onChangeText={(newContent) => setContent(newContent)}
        placeholder="What's on your mind?"
      />
      <Button
        title="Post"
        onPress={() => {
          createPost({ content });
          setContent("");
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    marginTop: 25,
  },
  postContainer: {
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 5,
    margin: (10, 10, 0, 10),
  },
  input: {
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 5,
    margin: (10, 10, 0, 10),
  },
});

export default CommunityFeed;
