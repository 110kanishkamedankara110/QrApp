import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pressable, Text, Animated } from "react-native";
import axios from "axios";
import { useFocusEffect } from "expo-router";

export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const [endpoint, setEndpoint] = useState("");
  const [message, setMessage] = useState("");

  useFocusEffect(() => {
    const loadEndpoint = async () => {
      try {
        const storedValue = await AsyncStorage.getItem("endpoint");
        if (storedValue) {
          setEndpoint(storedValue);
        }
      } catch (error) {
        console.error("Error loading endpoint:", error);
      }
    };

    loadEndpoint();
  });

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };
  const handlePausePreview = async () => {
    if (cameraRef.current) {
      await cameraRef.current.pausePreview();
    }
  };

  const handleResumePreview = async () => {
    if (cameraRef.current) {
      await cameraRef.current.resumePreview();
      setMessage("");
    }
    setScanned(false);
  };
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };
  const handleBarcodeScanned = async (result: any) => {
    if (scanned) return;
    await handlePausePreview();
    setScanned(true);
    if (endpoint == "" || endpoint == null) {
      Alert.alert("Warmimg", "Plese Enter Endpoint");
      return;
    }
    console.log(result.data);
    axios
      .post(endpoint, { mobile: result.data })
      .then((result) => {
        setMessage(result.data);
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";
        setMessage(errorMessage);
      });
  };
  let content;

  if (!permission) {
    content = <View />;
  } else if (!permission.granted) {
    content = (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>

        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={{
            marginTop: 30,
          }}
          onPress={requestPermission}
        >
          <Animated.View
            style={{
              backgroundColor: "white",
              borderRadius: 20,
              height: 50,
              paddingHorizontal: 20,
              alignItems: "center",
              justifyContent: "center",
              transform: [{ scale: scaleAnim }],
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "black" }}>
              Grant Permission
            </Text>
          </Animated.View>
        </Pressable>
      </View>
    );
  } else {
    content = (
      <CameraView
        ref={cameraRef}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={handleBarcodeScanned}
        style={styles.camera}
        facing={facing}
      >
        <View style={styles.viewStyle}>
          {!scanned && (
            <View
              style={{
                width: "70%",
                aspectRatio: 1,
                borderColor: "white",
                borderWidth: 4,
                borderRadius: 50,
              }}
            ></View>
          )}
        </View>
        <View style={styles.buttonContainer}>
          {scanned && (
            <>
              <Text
                style={{
                  color: "white",
                  fontSize: 30,
                  padding: 10,
                  textAlign: "center",
                }}
              >
                Response :
              </Text>
              <Text
                style={{
                  color: "yellow",
                  fontSize: 30,
                  padding: 10,
                  textAlign: "center",
                }}
              >
                {message}
              </Text>
              <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={{
                  marginTop: 30,
                }}
                onPress={handleResumePreview}
              >
                <Animated.View
                  style={{
                    backgroundColor: "white",
                    borderRadius: 20,
                    height: 50,
                    paddingHorizontal: 20,
                    alignItems: "center",
                    justifyContent: "center",
                    transform: [{ scale: scaleAnim }],
                  }}
                >
                  <Text
                    style={{ fontSize: 20, fontWeight: "bold", color: "black" }}
                  >
                    Scan
                  </Text>
                </Animated.View>
              </Pressable>
            </>
          )}
        </View>
      </CameraView>
    );
  }

  return <View style={styles.container}>{content}</View>;
}

const styles = StyleSheet.create({
  viewStyle: {
    width: "100%",
    height: "100%",
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
    color: "white",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    width: "100%",
    height: "100%",
    position: "absolute",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});
