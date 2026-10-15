import { StateView } from "@relife/ui";
import { router } from "expo-router";

import { Screen } from "@/components/Screen";

// The "Quét mã" tab opens the full-screen scanner instead (see (tabs)/_layout.tsx).
// This screen only shows if the tab is opened by a link.
export default function Route() {
  return (
    <Screen withTabBar>
      <StateView icon="camera" title="Quét mã nhận bánh" actionLabel="Mở máy quét" onAction={() => router.push("/scanner")} />
    </Screen>
  );
}
