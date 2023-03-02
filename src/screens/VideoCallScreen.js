import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import {
  RTCPeerConnection,
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

  const callRef = firestore().collection("calls");

  //Helper function. Put these in a hook maybe?
  async function setupWebRTC() {
    const localStream = await getMediaStreams();
    setLocalStream(localStream);
    //Get remote stream once it is available
    peerConnection.addEventListener("addstream", (event) => {
      peerConnection.addStream(localStream);
      setRemoteStream(event.stream);
    });
  }

  const createCall = async () => {
    await setupWebRTC();
    // const callRef = firestore().collection("rooms").doc("room1");
    exchangeICECandidates(callRef, "localCaller", "remoteCallee");

    //Now create the offer and store it in the firestore document
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

      const callWithOffer = {
        offer: {
          type: offerDescription.type,
          sdp: offerDescription.sdp,
        },
      };

      // Send the offerDescription to the other participant.
      callRef.add(callWithOffer);
      //This could be wrong
      setGettingCall(true);
    } catch (err) {
      // Handle Errors
    }
  };

  //Helper function. Put in hook maybe?
  async function exchangeICECandidates(callRef, localCaller, remoteCallee) {
    //Adding new ICE candidates to collection in Firestore
    const candidatesCollection = callRef.collection(localCaller);

    peerConnection.addEventListener("icecandidate", (event) => {
      if (!event.candidate) {
        console.log("Got final candidate!");
        return;
      }
      candidatesCollection.add(event.candidate.toJSON());
    });

    //Get ICE candidates from firstore and add them to the PeerConnection
    const remoteCalleeCandidatesCollection = callRef.collection(remoteCallee);

    remoteCalleeCandidatesCollection.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type == "added") {
          let candidate = change.doc.data();
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
      });
    });
  }

  // //This will be called once the media stream has been added to the peer connection
  // peerConnection.addEventListener("negotiationneeded", (event) => {
  //   // You can start the offer stages here.
  //   // Be careful as this event can be called multiple times.
  //   //Add method for creating the offer
  //   createOffer();
  // });

  // const createOffer = async () => {
  //   // Create an offer to send to the person you're calling.
  //   let sessionConstraints = {
  //     mandatory: {
  //       OfferToReceiveAudio: true,
  //       OfferToReceiveVideo: true,
  //       VoiceActivityDetection: true,
  //     },
  //   };

  //   try {
  //     const offerDescription = await peerConnection.createOffer(
  //       sessionConstraints
  //     );
  //     await peerConnection.setLocalDescription(offerDescription);

  //     // Send the offerDescription to the other participant.
  //     // You can send this via a signalling server.
  //     const roomWithOffer = {
  //       offer: {
  //         type: offerDescription.type,
  //         sdp: offerDescription.sdp,
  //       },
  //     };

  //     const roomRef = firestore().collection("rooms").doc("room1");
  //     await roomRef.set(roomWithOffer);

  //     roomRef.onSnapshot((snapshot) => {
  //       const data = snapshot.data();
  //       if (!peerConnection.currentRemoteDescription && data.answer) {
  //         const answerDescription = new RTCSessionDescription(data.answer);
  //         peerConnection.setRemoteDescription(answerDescription);
  //       }
  //     });
  //   } catch (err) {
  //     // Handle Errors
  //   }
  // };

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
    let sessionConstraints = {
      mandatory: {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true,
        VoiceActivityDetection: true,
      },
    };
    exchangeICECandidates(callRef, "remoteCallee", "localCaller");
    try {
      const receivedOfferDescription = new RTCSessionDescription(
        callRef.get().data().offer
      );
      await peerConnection.setRemoteDescription(receivedOfferDescription);

      //Create the answer and update the firestore document with the answer
      const answerDescription = await peerConnection.createAnswer(
        sessionConstraints
      );

      await peerConnection.setLocalDescription(answerDescription);

      const callWithAnswer = {
        answer: {
          type: answerDescription.type,
          sdp: answerDescription.sdp,
        },
      };

      callRef.update(callWithAnswer);
    } catch (err) {
      console.log(err);
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
