import { View, StyleSheet, Pressable } from "react-native";
import { Tabs } from "expo-router";
import { Entypo, AntDesign } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#fff",
        headerShown: false,
        tabBarBackground: () => <View style={styles.tabBarBackground} />,
        tabBarStyle: styles.tabBarStyle,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <Entypo name="link" size={28} color={focused ? "#FFD700" : "white"} />
          ),
          tabBarButton: (props) => <Pressable {...props} style={[props.style,{marginBottom:30}]} />, // Removes default feedback
        }}
      />

      <Tabs.Screen
        name="qr"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <AntDesign name="qrcode" size={28} color={focused ? "#FFD700" : "white"} />
          ),
          tabBarButton: (props) => <Pressable {...props} style={[props.style,{marginBottom:30}]} />, // Removes default feedback
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarBackground: {
    position: "absolute",
    left: 20,
    right: 20,
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.5)", 
    borderRadius: 20,
    overflow: "hidden",
  },
  tabBarStyle: {
    position: "absolute",
    display:'flex',
    bottom: 20,
    height: 80,
    borderTopWidth: 0,
    elevation: 0,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
