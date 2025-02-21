import { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, TextInput, View } from "react-native";

import { Pressable, Text, Animated } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
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

  const [endpoint, setEndpoint] = useState("");
  useEffect(() => {
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
  }, []);
  const saveEndpoint = async () => {
    try {
      await AsyncStorage.setItem("endpoint", endpoint);
      setEndpoint(endpoint);
      Alert.alert("Success","Saved: "+endpoint)
      console.log("Saved:", endpoint);
    } catch (error) {
      Alert.alert("Error","Error saving endpoint: "+ error)
    }
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          padding: 20,
        }}
      >
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

        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={{
            marginTop: 30,
          }}
          onPress={saveEndpoint}
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
              Save
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
