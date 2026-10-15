import { STORAGE_TYPE, type StorageType } from "@relife/shared";
import { Button, Card, Divider, Icon, IconButton, LoadingView, SelectChip, StepBar, Text, TextField, colors, fontFamily, spacing } from "@relife/ui";
import { router } from "expo-router";
import { Fragment, useState } from "react";
import { StyleSheet, View } from "react-native";

import { BottomBar } from "@/components/BottomBar";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";

import { useCharityApplication } from "../hooks/useCharity";

const STORAGE: { key: StorageType; label: string }[] = [
  { key: STORAGE_TYPE.ROOM, label: "Nhiệt độ phòng" },
  { key: STORAGE_TYPE.FRIDGE, label: "Tủ lạnh" },
  { key: STORAGE_TYPE.FREEZER, label: "Tủ đông" },
  { key: STORAGE_TYPE.COLD_VAN, label: "Xe lạnh" },
];

/** C01 Organisation Registration, step 3 of 5 (capacity), as in the Figma frame. */
export function CharityRegistrationScreen() {
  const app = useCharityApplication().data;
  const [portions, setPortions] = useState("80");
  const [storage, setStorage] = useState<StorageType[] | null>(null);
  if (!app) return <LoadingView />;
  const selected = storage ?? app.storage;

  return (
    <Screen
      header={<ScreenHeader title="Đăng ký tổ chức" />}
      footer={
        <BottomBar plain>
          {/* TODO(S9): save the step to `charityApplications/{uid}`. */}
          <Button title="Tiếp tục" onPress={() => router.replace("/verification")} />
        </BottomBar>
      }
    >
      <StepBar total={app.totalSteps} current={app.step} style={styles.steps} />
      <View style={styles.gap4}>
        <Text variant="overline" color="champagne" style={styles.overline}>
          BƯỚC {app.step} / {app.totalSteps} · NĂNG LỰC TIẾP NHẬN
        </Text>
        <Text style={styles.title}>Tổ chức của bạn nhận được bao nhiêu?</Text>
      </View>
      <TextField label="Số suất tối đa mỗi ngày" value={`${portions} suất`} onChangeText={(t) => setPortions(t.replace(/\D/g, ""))} keyboardType="number-pad" />
      <View style={styles.gap8}>
        <Text variant="label" color="stone">
          Khả năng bảo quản
        </Text>
        <View style={styles.chips}>
          {STORAGE.map((s) => (
            <SelectChip
              key={s.key}
              size="sm"
              label={s.label}
              selected={selected.includes(s.key)}
              onPress={() => setStorage(selected.includes(s.key) ? selected.filter((x) => x !== s.key) : [...selected, s.key])}
            />
          ))}
        </View>
      </View>
      <Card gap={12}>
        {app.documents.map((d, i) => (
          <Fragment key={d.key}>
            {i > 0 && <Divider />}
            <View style={styles.row}>
              <IconButton name={d.uploaded ? "file" : "plus"} size={40} iconSize={18} variant={d.uploaded ? "soft" : "linen"} accessibilityLabel="" />
              <View style={styles.flex}>
                <Text variant="bodyStrong" style={styles.t14}>
                  {d.label}
                </Text>
                <Text variant="caption" color={d.uploaded ? "success" : "stone"}>
                  {d.detail}
                </Text>
              </View>
              {d.uploaded ? (
                <Icon name="checkc" size={20} color="success" />
              ) : (
                <Text variant="labelStrong" color="forest">
                  Tải lên
                </Text>
              )}
            </View>
          </Fragment>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  gap4: { gap: 6 },
  steps: { marginTop: 4, marginBottom: -4 },
  overline: { letterSpacing: 1.32 },
  title: { fontFamily: fontFamily.heading, fontSize: 24, lineHeight: 30, color: colors.ink },
  t14: { fontSize: 14, lineHeight: 18 },
  gap8: { gap: spacing.xs },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  flex: { flex: 1, gap: 2 },
});
