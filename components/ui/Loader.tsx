import LottieView from "lottie-react-native";
import { View } from "react-native";

const Loader = () => {
  return (
    <>
      <View
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          zIndex: 9999,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(255,255,255,0.5)",
        }}
      >
        <View
          style={{
            width: "60%",
            aspectRatio: 1,
            backgroundColor: "white",
            zIndex: 9999,
            borderRadius: 50,
          }}
        >
          <LottieView
            source={require("@/assets/images/loader.json")} // Path to your JSON file
            autoPlay
            loop
            style={{
              width: "100%",
              height: "100%",
              zIndex: 9999,
            }}
          />
        </View>
      </View>
    </>
  );
};

export default Loader;
