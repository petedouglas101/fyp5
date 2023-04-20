import React from "react";
import { View, Text, StyleSheet } from "react-native";
import CallButton from "./CallButton";
import { RTCView, MediaStream } from "react-native-webrtc";

function ButtonConatiner({ hangup, hideCamera, toggleCamera }) {
  return (
    <View style={styles.buttonContainer}>
      <CallButton iconName="phone" backgroundColor="red" onPress={hangup} />
      <CallButton
        iconName="video"
        backgroundColor="grey"
        onPress={hideCamera}
      />
      <CallButton
        iconName="sync"
        backgroundColor="grey"
        onPress={toggleCamera}
      />
    </View>
  );
}

const VideoCall = ({
  localStream,
  remoteStream,
  hangup,
  hideCamera,
  toggleCamera,
}) => {
  return (
    <View style={styles.container}>
      {localStream && !remoteStream ? (
        <View style={styles.container}>
          <RTCView
            streamURL={localStream.toURL()}
            objectFit={"cover"}
            style={styles.video}
          />
          <ButtonConatiner hangup={hangup} />
        </View>
      ) : (
        <View style={styles.container}>
          <RTCView
            streamURL={remoteStream.toURL()}
            objectFit={"cover"}
            style={styles.video}
          />
          <RTCView
            streamURL={localStream.toURL()}
            objectFit={"cover"}
            style={styles.videoLocal}
          />
        </View>
      )}

      <ButtonConatiner
        hangup={hangup}
        localStream={localStream}
        remoteStream={remoteStream}
        hideCamera={hideCamera}
        toggleCamera={toggleCamera}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    bottom: 30,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  videoLocal: {
    position: "absolute",
    width: 100,
    height: 150,
    top: 0,
    left: 20,
    elevation: 10,
  },
});

export default VideoCall;
