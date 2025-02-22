import { View, StyleSheet, Pressable } from "react-native";
import { Tabs } from "expo-router";
import { Entypo, AntDesign } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#fff",
        headerShown: false,
        tabBarBackground: () => (
          <>
            <View style={styles.tabBarBackground}>
              <BlurView intensity={50} style={{ flex: 1 }} />
            </View>
          </>
        ),
        tabBarStyle: styles.tabBarStyle,
        tabBarItemStyle:{marginBottom:30,padding:20}
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="qrcode"
              size={28}
              color={focused ? "black" : "white"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <Entypo
              name="cog"
              size={28}
              color={focused ? "black" : "white"}
            />
          ),
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
    display: "flex",
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
