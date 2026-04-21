import { CustomTabBar } from "@/components/tabs/CustomTabBar";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="converter" options={{ title: "Converter" }} />
      <Tabs.Screen name="hydration" options={{ title: "Hydration" }} />
      <Tabs.Screen name="splitter" options={{ title: "Splitter" }} />
      <Tabs.Screen name="analytics" options={{ title: "Analytics" }} />
    </Tabs>
  );
}
