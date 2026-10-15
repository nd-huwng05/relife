import { router } from "expo-router";
import { Tabs } from "expo-router/js-tabs";

import { FloatingTabBar, type TabItem } from "@/components/FloatingTabBar";

const TABS: TabItem[] = [
  { name: "index", label: "Hôm nay", icon: "home" },
  { name: "bags", label: "Túi bánh", icon: "package" },
  { name: "scan", label: "Quét mã", icon: "camera" },
  { name: "revenue", label: "Doanh thu", icon: "chart" },
  { name: "settings", label: "Cửa hàng", icon: "settings" },
];

export default function StoreTabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <FloatingTabBar {...props} items={TABS} />}>
      {/* Declare every tab so the order (and the first tab) matches TABS. */}
      <Tabs.Screen name="index" />
      <Tabs.Screen name="bags" />
      <Tabs.Screen
        name="scan"
        listeners={{
          // The scanner is full screen without the tab bar (B12).
          tabPress: (e) => {
            e.preventDefault();
            router.push("/scanner");
          },
        }}
      />
      <Tabs.Screen name="revenue" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
