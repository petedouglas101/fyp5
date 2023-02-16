import React, { useContext, useState } from "react";
import { View, StyleSheet, TextInput, Button, FlatList } from "react-native";
import { Text } from "@rneui/themed";
import CommunityPost from "../components/CommunityPost";
import { Context as CommunityContext } from "../context/CommunityContext";

const CommunityScreen = ({ navigation }) => {
  const [content, setContent] = useState("");
  const { state, createPost, fetchPosts } = useContext(CommunityContext);

  navigation.addListener("focus", () => {
    fetchPosts();
  });
  console.log(state);
  return (
    <View style={styles.viewContainer}>
      <Text h2>Community</Text>
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
      {/* Generate a FlatList of posts, using the data from the CommunityContext fetch_posts action. Generate a key for each post */}
      <FlatList
        data={state}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          return (
            <CommunityPost
              post={item.content}
              date={item.date}
              user={item.userId}
            />
          );
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

export default CommunityScreen;
