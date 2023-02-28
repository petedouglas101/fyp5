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
    if (localStream) {
      setLocalStream(stream);
      peerConnection.addStream(localStream);
    }
    //Get remote stream once it is available
    peerConnection.addEventListener("addstream", (event) => {
      setRemoteStream(event.stream);
    });
  };

  const createCall = async () => {
    await setupWebRTC();
    const callRef = firestore().coolection("rooms").doc("room1");
    exchangeICECandidates(callRef, "localCaller", "remoteCallee");
  };

  const exchangeICECandidates = async (callRef, localCaller, remoteCallee) => {
    const callDoc = await callRef.get();

    const localCallerCandidatesCollection = callDoc.ref.collection(localCaller);

    peerConnection.addEventListener("icecandidate", (event) => {
      if (!event.candidate) {
        console.log("Got final candidate!");
        return;
      }

      localCallerCandidatesCollection.add(event.candidate.toJSON());
    });

    const remoteCalleeCandidatesCollection =
      callDoc.ref.collection(remoteCallee);

    remoteCalleeCandidatesCollection.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === "added") {
          let data = change.doc.data();
          await peerConnection.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  };

  //This will be called once the media stream has been added to the peer connection
  peerConnection.addEventListener("negotiationneeded", (event) => {
    // You can start the offer stages here.
    // Be careful as this event can be called multiple times.
    //Add method for creating the offer
    createOffer();
  });

  const createOffer = async () => {
    // Create an offer to send to the person you're calling.
    let sessionConstraints = {
      mandatory: {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true,
        VoiceActivityDetection: true,
      },
    };

    try {
      const offerDescription = await peerConnection.createOffer(
        sessionConstraints
      );
      await peerConnection.setLocalDescription(offerDescription);

      // Send the offerDescription to the other participant.
      // You can send this via a signalling server.
      const roomWithOffer = {
        offer: {
          type: offerDescription.type,
          sdp: offerDescription.sdp,
        },
      };

      const roomRef = firestore().collection("rooms").doc("room1");
      await roomRef.set(roomWithOffer);

      roomRef.onSnapshot((snapshot) => {
        const data = snapshot.data();
        if (!peerConnection.currentRemoteDescription && data.answer) {
          const answerDescription = new RTCSessionDescription(data.answer);
          peerConnection.setRemoteDescription(answerDescription);
        }
      });
    } catch (err) {
      // Handle Errors
    }
  };

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
      ) : (
        <CallButton iconName="video" backgroundColor="grey" onPress={create} />
      )}
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
