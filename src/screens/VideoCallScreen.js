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
    cRef.onSnapshot((snapshot) => {
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
          console.log("getting call is being set to true");
          setGettingCall(true);
        }
      });

      return () => subscribe();
    });
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
          // You can handle the call being connected here.
          // Like setting the video streams to visible.
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

  /** For disconnecting, close the connection, release the stream and delete the doc from firestore */
  const hangup = async () => {
    connecting.current = false;
    setGettingCall(false);
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
