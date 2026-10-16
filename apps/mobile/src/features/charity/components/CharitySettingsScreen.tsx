import { Button, Card, Divider, Icon, ListRow, LoadingView, Slider, Text, Toggle, colors, fontFamily } from "@relife/ui";
import { router } from "expo-router";
import { Fragment, useState } from "react";
import { StyleSheet, View } from "react-native";

import { Screen } from "@/components/Screen";
import { sessionStore } from "@/features/auth";
import { errorMessage } from "@/lib/queryClient";

import { useCharity, useUpdateCharitySettings } from "../hooks/useCharity";

/** C08 Area And Window Settings (Cài đặt tab). */
export function CharitySettingsScreen() {
  const query = useCharity();
  if (!query.data) return <LoadingView />;
  return <SettingsForm initial={query.data} />;
}

function SettingsForm({ initial }: { initial: NonNullable<ReturnType<typeof useCharity>["data"]> }) {
  const save = useUpdateCharitySettings();
  const [radiusKm, setRadius] = useState(initial.radiusKm);
  const [fridge, setFridge] = useState(initial.onlyMatchingStorage.fridge);
  const [freezer, setFreezer] = useState(initial.onlyMatchingStorage.freezer);

  return (
    <Screen withTabBar gap={12}>
      <Text style={styles.title}>Khu vực và giờ nhận</Text>
      <Card gap={10}>
        <View style={styles.between}>
          <Text variant="bodyStrong">Bán kính nhận</Text>
          <Text variant="bodyStrong" color="forest" style={styles.t14}>
            Trong {radiusKm} km
          </Text>
        </View>
        <Slider value={radiusKm} min={1} max={15} onChange={setRadius} accessibilityLabel="Bán kính nhận" />
      </Card>
      <Card gap={12}>
        <Text variant="bodyStrong">Chỉ hiện nguồn phù hợp khả năng bảo quản</Text>
        <View style={styles.between}>
          <Text variant="body" style={styles.t14}>
            Cần tủ lạnh
          </Text>
          <Toggle value={fridge} onValueChange={setFridge} accessibilityLabel="Cần tủ lạnh" />
        </View>
        <View style={styles.between}>
          <Text variant="body" style={styles.t14}>
            Cần tủ đông
          </Text>
          <Toggle value={freezer} onValueChange={setFreezer} accessibilityLabel="Cần tủ đông" />
        </View>
      </Card>
      <Card gap={12}>
        <Text variant="bodyStrong">Giờ có thể đến nhận</Text>
        {initial.windows.map((w) => (
          <Fragment key={w.label}>
            {w.start && w.end ? (
              <View style={styles.between}>
                <Text variant="label" style={styles.t14}>
                  {w.label}
                </Text>
                <View style={styles.window}>
                  <Icon name="clock" size={14} color="forest" />
                  <Text variant="captionStrong" color="forest">
                    {w.start} – {w.end}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.between}>
                <Text variant="label" color="stone" style={styles.t14}>
                  {w.label}
                </Text>
                <Text variant="small" color="stone">
                  Không nhận
                </Text>
              </View>
            )}
          </Fragment>
        ))}
      </Card>
      {save.isError && (
        <Text variant="caption" color="terracotta" align="center">
          {errorMessage(save.error)}
        </Text>
      )}
      <Button
        title={save.isSuccess ? "Đã lưu" : "Lưu cài đặt"}
        loading={save.isPending}
        onPress={() => save.mutate({ radiusKm, onlyMatchingStorage: { fridge, freezer } })}
      />
      <Card gap={12}>
        <ListRow icon="file" title="Hồ sơ tổ chức" subtitle="Năng lực tiếp nhận và giấy tờ" onPress={() => router.push("/org-register")} />
        <Divider />
        <ListRow icon="users" title="Trạng thái xác minh" onPress={() => router.push("/verification")} />
        <Divider />
        {__DEV__ && (
          <>
            <ListRow icon="settings" title="Trạng thái hệ thống (dev)" subtitle="Thử E01–E08" onPress={() => router.push("/dev-states")} />
            <Divider />
          </>
        )}
        <ListRow icon="logout" title="Đăng xuất" onPress={() => sessionStore.signOut()} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  t14: { fontSize: 14, lineHeight: 18 },
  window: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: colors.goldSoft },
  title: { fontFamily: fontFamily.heading, fontSize: 30, lineHeight: 40, color: colors.ink, marginTop: 2 },
  between: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
});
