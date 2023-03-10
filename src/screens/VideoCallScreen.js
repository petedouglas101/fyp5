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

  useEffect(() => {
    console.log("useEffectCalled");
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
        } else {
          console.log(
            "Peer connection not set. There was an error in useEffect"
          );
        }

        if (data && data.offer) {
          setGettingCall(true);
          console.log("Getting call has been set to: ", gettingCall);
        } else {
          console.log(
            "No offer in firestore setGettingCall is not true. Error found in useEffect"
          );
        }
      });

      return () => subscribe();
    });
  }, []);

  const setupWebRTC = async () => {
    console.log("Setting up WebRTC");
    peerConnection.current = new RTCPeerConnection(peerConstraints);
    const localStream = await getMediaStreams();
    console.log("Local stream is: ", localStream);
    setLocalStream(localStream);
    localStream.getTracks().forEach((track) => {
      console.log("Adding local track to peer connection");
      peerConnection.current.addTrack(track, localStream);
      console.log(
        " local Track added to peer connection",
        peerConnection.current
      );
    });

    //Get remote stream once it is available
    peerConnection.current.addEventListener("track", (event) => {
      console.log(
        "Adding track to remote stream. addEventListener called in setupWebRTC"
      );
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
      setRemoteStream(remoteStream);
      console.log("Remote stream is: ", remoteStream);
      remoteStream.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, remoteStream);
      });
    });
  };

  const createCall = async () => {
    console.log("Creating the call!");
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
    } catch (err) {
      // Handle Errors
      console.log("Error creating offer: ", err);
    }
  };

  //Helper function. Put in hook maybe?
  const exchangeICECandidates = (callRef, localCaller, remoteCallee) => {
    console.log("Exchanging ICE candidates!");
    //Adding new ICE candidates to collection in Firestore
    const candidatesCollection = callRef
      .collection("candidates")
      .doc(localCaller);

    peerConnection.current.addEventListener("icecandidate", (event) => {
      if (event.candidate) {
        candidatesCollection.set(event.candidate);
      }
    });

    const remoteCandidatesCollection = callRef
      .collection("candidates")
      .doc(remoteCallee);

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
  const hangup = async () => {};

  /**
   * This method is called when the remote callee presses the answer button. It exchanges the ICE
   * candidates, gets the offer from firestore, adds it to the peer connection. It then
   * creates the answer and updates the firestore document with the answer
   */
  const join = async () => {
    console.log("Joining the call!");
    setGettingCall(false);
    const callRef = firestore().collection("calls").doc("call1");

    callRef.onSnapshot(async (snapshot) => {
      const data = snapshot.data();
      const offer = data.offer;
      if (offer) {
        setupWebRTC();
        exchangeICECandidates(callRef, "remoteCallee", "localCaller");
        const receivedOfferDescription = new RTCSessionDescription(offer);
        await peerConnection.current.setRemoteDescription(
          receivedOfferDescription
        );
        //Create the answer and update the firestore document with the answer
        const answerDescription = await peerConnection.current.createAnswer();

        await peerConnection.current.setLocalDescription(answerDescription);
      }
    });

    const callWithAnswer = {
      answer: {
        type: peerConnection.current.localDescription.type,
        sdp: peerConnection.current.localDescription.sdp,
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
