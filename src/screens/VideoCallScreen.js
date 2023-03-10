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

  // //Helper function. Put these in a hook maybe?
  // async function setupWebRTC() {
  //   peerConnection.current = new RTCPeerConnection(peerConstraints);
  //   const localStream = await getMediaStreams();
  //   setLocalStream(localStream);
  //   localStream.getTracks().forEach((track) => {
  //     peerConnection.current.addTrack(track, localStream);
  //   });
  //   //Get remote stream once it is available
  //   peerConnection.current.addEventListener("track", (event) => {
  //     event.streams[0].getTracks().forEach((track) => {
  //       console.log("Add a track to the remoteStream:", track);
  //       remoteStream.addTrack(track);
  //     });
  //   });
  //   remoteStream.getTracks().forEach((track) => {
  //     console.log("Add a track to the remoteStream:", track);
  //     peerConnection.current.addTrack(track, remoteStream);
  //   });
  // }

  const setupWebRTC = async () => {
    peerConnection.current = new RTCPeerConnection(peerConstraints);
    const localStream = await getMediaStreams();
    setLocalStream(localStream);
    localStream.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, localStream);
      console.log("Add a track to the localStream:", track);
      console.log("peerConnection.current", peerConnection.current);
    });

    //Get remote stream once it is available
    peerConnection.current.addEventListener("track", (event) => {
      event.streams[0].getTracks().forEach((track) => {
        console.log("Add a track to the remoteStream:", track);
        remoteStream.addTrack(track);
      });
      remoteStream.getTracks().forEach((track) => {
        console.log("Add a track to the peerConnection:", track);
        peerConnection.current.addTrack(track, remoteStream);
        console.log("remoteStream", remoteStream);
      });
    });
  };

  const createCall = async () => {
    await setupWebRTC();
    const callRef = firestore().collection("calls");

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

      // Send the offerDescription to the other participant.
      callRef.set(callWithOffer);
      // exchangeICECandidates(callRef, "localCaller", "remoteCallee");
      setGettingCall(true);
    } catch (err) {
      // Handle Errors
    }
  };

  //Helper function. Put in hook maybe?
  const exchangeICECandidates = (callRef, localCaller, remoteCallee) => {
    //Adding new ICE candidates to collection in Firestore
    const candidatesCollection = callRef.doc(localCaller);

    peerConnection.current.addEventListener("icecandidate", (event) => {
      if (event.candidate) {
        console.log("adding candidate", event.candidate);
        candidatesCollection.set(event.candidate);
        console.log("candidatesCollection", candidatesCollection);
      }
    });

    const remoteCandidatesCollection = callRef.doc(remoteCallee);

    remoteCandidatesCollection.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type == "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          console.log("adding remote candidate", candidate);
          peerConnection.current.addIceCandidate(candidate);
        }
      });
    });
  };

  /** For disconnecting, close the connection, release the stream and delete the doc from firestore */
  const hangup = async () => {};

  /**
   * This method is called when the remote callee presses the answer button. It exchanges the ICE
   * candidates, gets the offer from firestore, adds it to the peer connection. It then
   * creates the answer and updates the firestore document with the answer
   */
  const join = async () => {
    console.log("Joining the call!");
    const callRef = firestore().collection("calls");
    setGettingCall(false);

    callRef.onSnapshot(async (snapshot) => {
      const data = snapshot.data();
      const offer = data.offer;
      const receivedOfferDescription = new RTCSessionDescription(offer);
      await peerConnection.current.setRemoteDescription(
        receivedOfferDescription
      );
      //Create the answer and update the firestore document with the answer
      const answerDescription = await peerConnection.current.createAnswer();

      await peerConnection.current.setLocalDescription(answerDescription);
    });

    const callWithAnswer = {
      answer: {
        type: peerConnection.current.localDescription.type,
        sdp: peerConnection.current.localDescription.sdp,
      },
    };

    callRef.update(callWithAnswer);
    exchangeICECandidates(callRef, "remoteCallee", "localCaller");
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
