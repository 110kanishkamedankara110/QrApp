import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, AppState, StyleSheet, TextInput, View } from "react-native";

import { Pressable, Text, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";

export default function App() {
  useEffect(() => {
    const handleAppStateChange = (nextAppState: any) => {
      if (nextAppState === "background") {
        console.log("background...");
        setEditable(false);
      } else if (nextAppState === "active") {
        console.log("active");
        setEditable(false);
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, []);
  useFocusEffect(
    useCallback(() => {
      console.log("Tab is focused");
      setEditable(false);

      return () => {
        console.log("Tab is unfocused");
        setEditable(false); 
      };
    }, [])
  );
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

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

  const [endpoint, setEndpoint] = useState("");
  const [editable, setEditable] = useState(false);

  function isValidUrl(value: string) {
    try {
      new URL(value);
      return true;
    } catch (_) {
      return false;
    }
  }

  const saveEndpoint = async () => {
    if (endpoint.trim() != "") {
      if (isValidUrl(endpoint)) {
        Alert.alert("Confirm Action", "Are you sure you want to proceed?", [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => {
              setEditable(false);
            },
          },
          {
            text: "OK",
            onPress: async () => {
              try {
                await AsyncStorage.setItem("endpoint", endpoint);
                setEndpoint(endpoint);
                Alert.alert("Success", "Saved: " + endpoint);
                console.log("Saved:", endpoint);
              } catch (error) {
                Alert.alert("Error", "Error saving endpoint: " + error);
              } finally {
                setEditable(false);
              }
            },
          },
        ]);
      } else {
        Alert.alert("Error", "Invalid Endpoint");
        setEditable(false);
      }
    } else {
      Alert.alert("Error", "Endpoint is Empty");
      setEditable(false);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          padding: 20,
        }}
      >
        {editable && (
          <>
            <Text
              style={{
                marginBottom: 10,
                fontSize: 20,
                color: "white",
              }}
            >
              Endpoint
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
              }}
              value={endpoint}
              onChangeText={setEndpoint}
              placeholderTextColor={"rgba(255, 255, 255, 0.5)"}
              placeholder="Endpoint"
            />
          </>
        )}

        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={{
            marginTop: 30,
          }}
          onPress={() => {
            if (editable) {
              saveEndpoint();
            } else {
              loadEndpoint();
              setEditable(true);
            }
          }}
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
              {editable ? "Save Endpoint" : "Edit Endpoint"}
            </Text>
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );
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
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
  },
});
