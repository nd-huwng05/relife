import { Tabs } from "expo-router/js-tabs";

import { FloatingTabBar, type TabItem } from "@/components/FloatingTabBar";

const TABS: TabItem[] = [
  { name: "index", label: "Nguồn", icon: "home" },
  { name: "claims", label: "Phiếu nhận", icon: "file" },
  { name: "report", label: "Báo cáo", icon: "chart" },
  { name: "area", label: "Cài đặt", icon: "settings" },
];

export default function CharityTabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <FloatingTabBar {...props} items={TABS} />}>
      {/* Declare every tab so the order (and the first tab) matches TABS. */}
      {TABS.map((t) => (
        <Tabs.Screen key={t.name} name={t.name} />
      ))}
    </Tabs>
  );
}
