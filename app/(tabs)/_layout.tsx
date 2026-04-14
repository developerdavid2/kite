import { CustomTabBar } from "@/components/tabs/CustomTabBar";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="converter" />
      <Tabs.Screen name="hydration" />
      <Tabs.Screen name="splitter" />
      <Tabs.Screen name="analytics" />
    </Tabs>
  );
}
