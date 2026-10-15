import { Tabs } from "expo-router/js-tabs";

import { FloatingTabBar, type TabItem } from "@/components/FloatingTabBar";

const TABS: TabItem[] = [
  { name: "index", label: "Khám phá", icon: "home" },
  { name: "map", label: "Bản đồ", icon: "nav" },
  { name: "orders", label: "Đơn hàng", icon: "bag" },
  { name: "saved", label: "Đã lưu", icon: "heart" },
  { name: "profile", label: "Tài khoản", icon: "user" },
];

export default function CustomerTabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <FloatingTabBar {...props} items={TABS} />}>
      {/* Declare every tab so the order (and the first tab) matches TABS. */}
      {TABS.map((t) => (
        <Tabs.Screen key={t.name} name={t.name} />
      ))}
    </Tabs>
  );
}
