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
  const configuration = {
    iceServers: [{ url: "stun:stun.l.google.com:19302" }],
  };
  const { getMediaStreams } = useMediaStreams();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [gettingCall, setGettingCall] = useState(false);
  const peerConnection = new RTCPeerConnection(configuration);
  const connecting = useRef(false);

  //   useEffect(() => {
  //     const callRef = firestore().collection("meet").doc("chatId");
  //     const subscribe = callRef.onSnapshot((snapshot) => {
  //       if (snapshot.data().offer && !connecting.current) {
  //         const data = snapshot.data();

  //         if (
  //           peerConnection &&
  //           peerConnection.remoteDescription &&
  //           data &&
  //           data.answer
  //         ) {
  //           peerConnection.setRemoteDescription(
  //             new RTCSessionDescription(data.answer)
  //           );
  //         }

  //         if (data && data.offer && !connecting.current) {
  //           setGettingCall(true);
  //         }
  //       }
  //     });
  //     const subscribeDelete = callRef
  //       .collection("callee")
  //       .onSnapshot((snapshot) => {
  //         snapshot.docChanges().forEach((change) => {
  //           if (change.type === "removed") {
  //             hangup();
  //           }
  //         });
  //       });

  //     return () => {
  //       subscribe();
  //       subscribeDelete();
  //     };
  //   }, []);

  const setupWebRTC = async () => {
    const stream = await getMediaStreams();
    if (stream) {
      console.log("stream", stream);
      setLocalStream(stream);
      peerConnection.addStream(stream);
    }
    //Get remote stream once it is available
    peerConnection.addEventListener("addstream", (event) => {
      console.log("event", event.stream);
      setRemoteStream(event.stream);
    });

    // peerConnection.onaddstream = (event) => {
    //   setRemoteStream(event.stream);
    // };
  };
  const hangup = async () => {
    setGettingCall(false);
    connecting.current = false;
    streamCleanup();
    firestoreCleanup();
    if (peerConnection) {
      peerConnection.close();
    }
  };

  const streamCleanup = async () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      localStream.release();
    }
    setLocalStream(null);
    setRemoteStream(null);
  };
  const firestoreCleanup = async () => {
    const callRef = firestore().collection("meet").doc("chatId");

    if (callRef) {
      const calleeCandidates = await callRef.collection("callee").get();
      calleeCandidates.forEach(async (candidate) => {
        await candidate.ref.delete();
      });

      const callerCandidates = await callRef.collection("caller").get();
      callerCandidates.forEach(async (candidate) => {
        await candidate.ref.delete();
      });

      await callRef.delete();
    }
  };

  const join = async () => {
    console.log("joining");
    connecting.current = true;
    setGettingCall(false);

    const callRef = firestore().collection("meet").doc("chatId");
    const offer = (await callRef.get()).data().offer;

    if (offer) {
      await setupWebRTC();

      //Exchange ICE candidates
      collectIceCandidates(callRef, "callee", "caller");

      if (peerConnection) {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(offer)
        );
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        const callWithAnswer = {
          answer: {
            type: answer.type,
            sdp: answer.sdp,
          },
        };
        await callRef.update(callWithAnswer);
      }
    }
  };

  const create = async () => {
    console.log("calling");
    console.log("connecting", connecting.current);
    console.log("peerConnection", peerConnection);
    connecting.current = true;
    await setupWebRTC();
    const callRef = firestore().collection("meet").doc("chatId");
    //Exchange ICE candidates between caller and callee
    collectIceCandidates(callRef, "caller", "callee");

    if (peerConnection) {
      console.log("peerConnection", peerConnection);
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      const callWithOffer = { offer: { type: offer.type, sdp: offer.sdp } };
      callRef.set({ callWithOffer });
    }
  };

  //Helper function to exchange ICE candidates between caller and callee. Caller is local user and callee is remote user
  const collectIceCandidates = async (callRef, caller, callee) => {
    const candidatesCollection = callRef.collection(caller);
    if (peerConnection) {
      peerConnection.addEventListener("icecandidate", (event) => {
        if (event.candidate) {
          candidatesCollection.add({
            userId: callee,
            candidate: event.candidate,
          });
        }
      });
    }

    //get the ICE candidates added to firestore and update the peer connection
    callRef.collection(callee).onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(change.doc.data().candidate);
          peerConnection.addIceCandidate(candidate);
        }
      });
    });
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
