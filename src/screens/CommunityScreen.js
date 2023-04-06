import React, { useContext, useState } from "react";
import { View, StyleSheet, TextInput, Button, FlatList } from "react-native";
import { Text } from "@rneui/themed";
import CommunityPost from "../components/CommunityPost";
import { Context as CommunityContext } from "../context/CommunityContext";

const CommunityScreen = ({ navigation }) => {
  const [content, setContent] = useState("");
  const { state, createPost, fetchPosts } = useContext(CommunityContext);

  function sortByDate(a, b) {
    return new Date(b.date) - new Date(a.date);
  }

  const sortedPosts = state.sort(sortByDate);

  navigation.addListener("focus", () => {
    fetchPosts();
  });
  return (
    <View style={styles.rootContainer}>
      <Text h2>Community</Text>
      <View style={styles.postInputContainer}>
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
          color={"#6699CC"}
          onPress={() => {
            createPost({ content });
            setContent("");
          }}
        />
      </View>
      <View style={styles.postContainer}>
        <FlatList
          data={sortedPosts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            return (
              <View>
                <CommunityPost
                  post={item.content}
                  date={item.date}
                  user={item.username}
                />
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    marginTop: 25,
  },
  postContainer: {
    borderBottomWidth: 1,
    borderColor: "red",
    borderRadius: 5,
    margin: (10, 10, 0, 10),
  },
  postInputContainer: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 5,
    margin: (10, 10, 0, 10),
  },
  input: {
    paddingLeft: 5,
  },
});

export default CommunityScreen;
