import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStream,
} from "react-native-webrtc";
import CallButton from "../components/CallButton";
import GettingCall from "../components/GettingCall";
import VideoCall from "../components/VideoCall";
import { useMediaStreams } from "../hooks/useMediaStreams";
import firestore from "@react-native-firebase/firestore";
import * as RootNavigation from "../navigationRef";

const VideoCallScreen = () => {
  const peerConstraints = {
    iceServers: [
      {
        urls: ["stun:stun.l.google.com:19302", "stun:stun2.l.google.com:19302"],
      },
    ],
    iceCandidatePoolSize: 10,
  };
  const { getMediaStreams } = useMediaStreams();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(new MediaStream());
  const [gettingCall, setGettingCall] = useState(false);
  const peerConnection = useRef(null);
  const connecting = useRef(false);

  useEffect(() => {
    const cRef = firestore().collection("calls").doc("call1");

    const subscribe = cRef.onSnapshot((snapshot) => {
      const data = snapshot.data();
      if (
        peerConnection.current &&
        !peerConnection.current.remoteDescription &&
        data.answer
      ) {
        const answerDescription = new RTCSessionDescription(data.answer);
        peerConnection.current.setRemoteDescription(answerDescription);
      }

      if (data && data.offer && !connecting.current) {
        setGettingCall(true);
      }
    });

    const unsubscribe = cRef
      .collection("remoteCallee")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === "removed") {
            hangup();
          }
        });
      });

    return () => {
      subscribe();
      unsubscribe();
    };
  }, []);

  const setupWebRTC = async () => {
    peerConnection.current = new RTCPeerConnection(peerConstraints);
    const localStream = await getMediaStreams();
    try {
      localStream.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, localStream);
      });

      setLocalStream(localStream);
    } catch (err) {}

    peerConnection.current.ontrack = ({ track, streams }) => {
      if (remoteStream._tracks.length > 0) {
        return;
      }
      setRemoteStream(streams[0]);
    };
  };

  const createCall = async () => {
    connecting.current = true;
    await setupWebRTC();
    const callRef = firestore().collection("calls").doc("call1");

    exchangeICECandidates(callRef, "localCaller", "remoteCallee");

    try {
      const offerDescription = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offerDescription);

      const callWithOffer = {
        offer: {
          type: offerDescription.type,
          sdp: offerDescription.sdp,
        },
      };
      callRef.set(callWithOffer);
    } catch (err) {}

    peerConnection.current.iceconnectionstatechange = (event) => {
      switch (peerConnection.current.iceConnectionState) {
        case "connected":
          setGettingCall(false);
          break;
        case "completed":
          break;
      }
    };
  };

  //
  const exchangeICECandidates = (callRef, localCaller, remoteCallee) => {
    const candidatesCollection = callRef.collection(localCaller);

    peerConnection.current.addEventListener("icecandidate", (event) => {
      if (event.candidate) {
        candidatesCollection.add(event.candidate.toJSON());
      }
    });

    const remoteCandidatesCollection = callRef.collection(remoteCallee);

    remoteCandidatesCollection.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type == "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          peerConnection.current.addIceCandidate(candidate);
        }
      });
    });
  };

  const hangup = async () => {
    connecting.current = false;
    setGettingCall(false);
    streamCleanup();
    firestoreCleanup();
    if (peerConnection.current) {
      peerConnection.current.close();
    }
  };

  const streamCleanup = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    peerConnection.current.close();
    setLocalStream(null);
    setRemoteStream(null);
    RootNavigation.navigate("VideoCall");
  };

  const firestoreCleanup = async () => {
    const callRef = firestore().collection("calls").doc("call1").delete();
    if (callRef) {
      const remoteCallee = await callRef.collection("remoteCallee").get();
      remoteCallee.forEach(async (candidate) => {
        await candidate.ref.delete();
      });

      const localCaller = await callRef.collection("localCaller").get();
      localCaller.forEach(async (candidate) => {
        await candidate.ref.delete();
      });

      callRef.delete();
    }
  };

  const join = async () => {
    connecting.current = true;
    setGettingCall(false);
    setupWebRTC();
    const callRef = firestore().collection("calls").doc("call1");

    const callData = (await callRef.get()).data();

    exchangeICECandidates(callRef, "remoteCallee", "localCaller");

    const offerDescription = callData.offer;
    await peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(offerDescription)
    );

    const answerDescription = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answerDescription);

    const callWithAnswer = {
      answer: {
        type: answerDescription.type,
        sdp: answerDescription.sdp,
      },
    };

    callRef.update(callWithAnswer);
  };

  const toggleCamera = () => {
    localStream.getVideoTracks()[0]._switchCamera();
  };

  const hideCamera = () => {
    localStream.getVideoTracks()[0].enabled =
      !localStream.getVideoTracks()[0].enabled;
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
            hideCamera={hideCamera}
            toggleCamera={toggleCamera}
          />
        </View>
      ) : (
        <CallButton
          iconName="video"
          backgroundColor="grey"
          onPress={createCall}
        />
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
