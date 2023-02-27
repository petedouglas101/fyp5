import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  MediaStream,
  RTCPeerConnection,
  RTCView,
  onaddstream,
  RTCIceCandidate,
  RTCSessionDescription,
} from "react-native-webrtc";
import CallButton from "../components/CallButton";
import GettingCall from "../components/GettingCall";
import VideoCall from "../components/VideoCall";
import { useMediaStreams } from "../hooks/useMediaStreams";
import firestore from "@react-native-firebase/firestore";

const VideoCallScreen = () => {
  const peerConstraints = {
    iceServers: [{ url: "stun:stun.l.google.com:19302" }],
  };
  const { getMediaStreams } = useMediaStreams();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [gettingCall, setGettingCall] = useState(false);
  let peerConnection = new RTCPeerConnection(peerConstraints);
  const connecting = useRef(false);

  const setupWebRTC = async () => {
    const localStream = await getMediaStreams();
    if (stream) {
      console.log("localStream", localStream);
      setLocalStream(stream);
      peerConnection.addStream(localStream);
    }
    //Get remote stream once it is available
    peerConnection.addEventListener("addstream", (event) => {
      console.log("event", event.stream);
      setRemoteStream(event.stream);
    });
  };

  const create = peerConnection.addEventListener("icecandidate", (event) => {
    // When you find a null candidate then there are no more candidates.
    // Gathering of candidates has finished.
    if (!event.candidate) {
      return;
    }

    // Send the event.candidate onto the person you're calling.
    // Keeping to Trickle ICE Standards, you should send the candidates immediately.
    console.log("ICE Candidate: ", event.candidate);
  });

  return (
    <View style={styles.container}>
      {gettingCall ? (
        <View style={styles.container}>
          <GettingCall hangup={hangup} join={join} />
        </View>
      ) : null}
      {localStream ? (
        <View style={styles.container}>
          <VideoCall
            localStream={localStream}
            remoteStream={remoteStream}
            hangup={hangup}
          />
        </View>
      ) : null}
      <CallButton iconName="video" backgroundColor="grey" onPress={create} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c3e50",
  },
});
export default VideoCallScreen;
