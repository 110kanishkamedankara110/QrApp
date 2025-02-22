import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Alert, StyleSheet, TextInput, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pressable, Text, Animated } from "react-native";
import axios from "axios";
import { router, useFocusEffect } from "expo-router";
import { BlurView } from "expo-blur";
import Loader from "@/components/ui/Loader";
import LottieView from "lottie-react-native";

export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const [endpoint, setEndpoint] = useState("");
  const [value, setvalue] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
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

  const handleBarcodeScanned = async () => {
    if (scanned) return;
    if (value == "") {
      Alert.alert("Warning", "Enter Id");
    } else {
      setLoading(true);
      await handlePausePreview();
      setScanned(true);
      if (endpoint == "" || endpoint == null) {
        Alert.alert("Warmimg", "Plese Enter Endpoint");
        setLoading(false);
        router.push("/settings");
        return;
      }

      axios
        .post(endpoint, { data: value })
        .then((result) => {
          setMessage(result.data);
          setLoading(false);
        })
        .catch((error) => {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "An unknown error occurred";
          setMessage(errorMessage);
          setLoading(false);
        })
        .finally(() => {
          setvalue("");
        });
    }
  };
  let content;

  content = (
    <>
      {loading && <Loader />}

      <View style={styles.viewStyle}>
        {!scanned && (
          <View
            style={{
              width: "80%",
              aspectRatio: 1,
            }}
          >
            <Pressable
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              style={{
                marginTop: 30,
              }}
              onPress={handleBarcodeScanned}
            >
              <Text
                style={{
                  marginBottom: 10,
                  fontSize: 20,
                  color: "white",
                }}
              >
                Data
              </Text>

              <TextInput
                style={{
                  borderRadius: 20,
                  borderColor: "white",
                  borderWidth: 2,
                  color: "white",
                  height: 80,
                  fontSize: 20,
                  padding: 20,
                  marginBottom: 30,
                }}
                value={value}
                onChangeText={setvalue}
                placeholderTextColor={"rgba(255, 255, 255, 0.5)"}
                placeholder="Data"
              />
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
                  Send
                </Text>
              </Animated.View>
            </Pressable>
          </View>
        )}
      </View>
      <View style={styles.buttonContainer}>
        {scanned && (
          <View
            style={{
              padding: 20,
              backgroundColor: "rgba(255,255,255,0.50)",
              borderRadius: 20,
              zIndex: 0,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 35,
                padding: 10,
                textAlign: "center",
              }}
            >
              Response
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
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "black",
                  }}
                >
                  Resume
                </Text>
              </Animated.View>
            </Pressable>
          </View>
        )}
      </View>
    </>
  );

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
