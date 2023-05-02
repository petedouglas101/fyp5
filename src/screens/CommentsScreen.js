import React, { useState, useContext, useEffect } from "react";
import { View, TextInput, StyleSheet, Button, FlatList } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Context as CommunityContext } from "../context/CommunityContext";
import Comment from "../components/Comment";

const CommentsScreen = () => {
  const [comment, setComment] = useState("");
  const { fetchComments, addComment } = useContext(CommunityContext);

  const route = useRoute();
  const comments = route.params.comments;
  const post = route.params.post;
  const id = route.params.id;

  function sortByDate(a, b) {
    return new Date(b.date) - new Date(a.date);
  }

  const sortedComments = comments.sort(sortByDate);

  return (
    <View style={styles.container}>
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.input}
          multiline={true}
          numberOfLines={4}
          value={comment}
          onChangeText={(newComment) => setComment(newComment)}
          placeholder="Add a comment..."
        />
        <Button
          title="Post"
          color={"#6699CC"}
          onPress={() => {
            addComment({ comment, id });
            setComment("");
          }}
        />
      </View>
      <View style={styles.commentsContainer}>
        <FlatList
          data={sortedComments}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            return (
              <View>
                <Comment
                  comment={item.content}
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
  container: {
    flex: 1,
    marginTop: 50,
    justifyContent: "center",
  },
  commentInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#ffffff",
  },
  input: {
    flex: 1,
    marginRight: 10,
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 10,
  },
  commentsContainer: {
    flex: 1,
    marginTop: 10,
    padding: 10,
    // backgroundColor: "#ffffff",
  },
});

export default CommentsScreen;
