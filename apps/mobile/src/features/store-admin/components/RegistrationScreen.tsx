import type { GeoPoint } from "@relife/shared";
import { Button, Card, Chip, Divider, Icon, IconButton, InfoNote, KeyValueRow, StepBar, Text, TextField, colors, fontFamily } from "@relife/ui";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { Fragment, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { BottomBar, ButtonRow } from "@/components/BottomBar";
import { RelifeMap } from "@/components/RelifeMap";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { errorMessage } from "@/lib/queryClient";

import { payoutOptions, storeContent } from "../api";
import { useApplication, useSubmitApplication } from "../hooks/useStoreAdmin";

const STEPS = storeContent.registrationSteps;
const HEADINGS = [
  "Kể cho khách về tiệm của bạn",
  "Giấy tờ để Relife xác minh",
  "Tiệm mở cửa lúc nào?",
  "Tiệm của bạn ở đâu?",
  "Relife chuyển tiền vào đâu?",
  "Kiểm tra lại trước khi gửi",
];

interface Form {
  name: string;
  category: string;
  phone: string;
  docs: Record<string, string | null>;
  address: string;
  pin: GeoPoint;
  bank: string;
  account: string;
  holder: string;
}

/** B01 Store Registration, six steps. Figma shows step 4 (location); the others follow the same layout. */
export function RegistrationScreen({ initialStep = 1, mode = "signup" }: { initialStep?: number; mode?: "signup" | "edit" }) {
  const app = useApplication().data;
  const submit = useSubmitApplication();
  const [step, setStep] = useState(Math.min(Math.max(initialStep, 1), STEPS.length));
  const [form, setForm] = useState<Form>({
    name: "Maison Bơ Sữa",
    category: "Tiệm bánh Pháp",
    phone: "912345678",
    docs: { license: null, food_safety: null },
    address: app?.address ?? "",
    pin: { lat: 21.0313, lng: 105.7905 },
    bank: payoutOptions.banks[0] ?? "",
    account: "",
    holder: "",
  });
  const set = (p: Partial<Form>) => setForm((f) => ({ ...f, ...p }));

  const pickDoc = async (key: string) => {
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.8 });
    // TODO(S2): upload to Storage `storeApplications/{uid}/` and store the path.
    if (!r.canceled && r.assets[0]) set({ docs: { ...form.docs, [key]: r.assets[0].uri } });
  };

  const last = step === STEPS.length;
  const next = () => {
    if (mode === "edit") return router.back();
    if (!last) return setStep(step + 1);
    submit.mutate(undefined);
  };

  return (
    <Screen
      header={<ScreenHeader title={mode === "edit" ? STEPS[step - 1] : "Đăng ký cửa hàng"} onLeadingPress={() => (step > 1 && mode === "signup" ? setStep(step - 1) : router.back())} />}
      footer={
        <BottomBar plain>
          {submit.isError && (
            <Text variant="caption" color="terracotta" align="center">
              {errorMessage(submit.error)}
            </Text>
          )}
          <ButtonRow>
            {step > 1 && mode === "signup" && <Button title="Quay lại" variant="secondary" fullWidth={false} style={styles.back} onPress={() => setStep(step - 1)} />}
            <Button title={mode === "edit" ? "Lưu" : last ? "Gửi hồ sơ" : "Tiếp tục"} style={styles.flex} loading={submit.isPending} onPress={next} />
          </ButtonRow>
        </BottomBar>
      }
    >
      {mode === "signup" && (
        <>
          <StepBar total={STEPS.length} current={step} style={styles.steps} />
          <Text variant="overline" color="champagne" style={styles.overline}>
            BƯỚC {step} / {STEPS.length} · {(STEPS[step - 1] ?? "").toUpperCase()}
          </Text>
        </>
      )}
      <Text style={styles.title}>{HEADINGS[step - 1]}</Text>

      {step === 1 && (
        <>
          <TextField label="Tên tiệm" value={form.name} onChangeText={(name) => set({ name })} />
          <TextField label="Loại hình" value={form.category} onChangeText={(category) => set({ category })} helper="Ví dụ: Tiệm bánh Pháp, Bánh mì thủ công" />
          <TextField label="Số điện thoại tiệm" prefix="+84" value={form.phone} onChangeText={(phone) => set({ phone: phone.replace(/\D/g, "") })} keyboardType="phone-pad" />
        </>
      )}

      {step === 2 && (
        <Card gap={14}>
          {[
            { key: "license", label: "Giấy phép kinh doanh" },
            { key: "food_safety", label: "Giấy chứng nhận ATTP" },
          ].map((d, i) => (
            <Fragment key={d.key}>
              {i > 0 && <Divider />}
              <View style={styles.docRow}>
                <IconButton name={form.docs[d.key] ? "file" : "plus"} size={40} iconSize={18} variant="linen" accessibilityLabel="" />
                <View style={styles.flex}>
                  <Text variant="bodyStrong">{d.label}</Text>
                  <Text variant="caption" color="stone">
                    {form.docs[d.key] ? "Ảnh · đã tải lên" : "Chưa tải lên"}
                  </Text>
                </View>
                {form.docs[d.key] ? (
                  <Icon name="checkc" size={20} color="success" />
                ) : (
                  <Pressable accessibilityRole="button" onPress={() => pickDoc(d.key)} hitSlop={8}>
                    <Text variant="labelStrong" color="champagne">
                      Tải lên
                    </Text>
                  </Pressable>
                )}
              </View>
            </Fragment>
          ))}
        </Card>
      )}

      {step === 3 && (
        <Card gap={10}>
          <KeyValueRow label="Thứ 2 – Thứ 6" value="07:00 – 21:00" />
          <KeyValueRow label="Thứ 7" value="07:00 – 22:00" />
          <KeyValueRow label="Chủ nhật" value="Đóng cửa" valueColor="stone" />
          <Text variant="caption" color="stone">
            Khung giờ nhận túi sẽ được gợi ý theo giờ mở cửa.
          </Text>
        </Card>
      )}

      {step === 4 && (
        <>
          <TextField
            label="Địa chỉ"
            value={form.address}
            onChangeText={(address) => set({ address })}
            left={<Icon name="nav" size={18} color="forest" />}
            placeholder="Số nhà, đường, phường, quận"
          />
          <RelifeMap
            style={styles.map}
            center={form.pin}
            span={0.006}
            draggablePin={{ coordinate: form.pin, label: "Cửa ra vào", onChange: (pin) => set({ pin }) }}
          >
            <View style={styles.mapChip} pointerEvents="none">
              <Chip label="Kéo ghim tới đúng cửa ra vào" tone="white" icon="info" />
            </View>
          </RelifeMap>
          <InfoNote tone="soft">Định vị tự động hay đặt nhầm bên kia đường. Khách sẽ đi theo đúng ghim này.</InfoNote>
        </>
      )}

      {step === 5 && (
        <>
          <TextField label="Ngân hàng" value={form.bank} onChangeText={(bank) => set({ bank })} />
          <TextField label="Số tài khoản" value={form.account} onChangeText={(account) => set({ account: account.replace(/\D/g, "") })} keyboardType="number-pad" />
          <TextField label="Chủ tài khoản" value={form.holder} onChangeText={(holder) => set({ holder: holder.toUpperCase() })} autoCapitalize="characters" />
          <InfoNote icon="lock">Số tài khoản chỉ chủ tiệm và bộ phận tài chính của Relife xem được.</InfoNote>
        </>
      )}

      {step === 6 && (
        <Card gap={10}>
          <KeyValueRow label="Tên tiệm" value={form.name} />
          <KeyValueRow label="Loại hình" value={form.category} />
          <KeyValueRow label="Giấy tờ" value={`${Object.values(form.docs).filter(Boolean).length} / 2`} />
          <KeyValueRow label="Địa chỉ" value={form.address || "Chưa nhập"} />
          <KeyValueRow label="Ngân hàng" value={form.account ? `${form.bank} ••${form.account.slice(-4)}` : "Chưa nhập"} />
          <Text variant="caption" color="stone">
            Relife thường phản hồi trong 1 đến 2 ngày làm việc.
          </Text>
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { width: 120 },
  steps: { marginTop: 4 },
  overline: { letterSpacing: 1.32, marginTop: -4 },
  title: { fontFamily: fontFamily.heading, fontSize: 26, lineHeight: 34, color: colors.ink, marginTop: -6 },
  flex: { flex: 1, gap: 2 },
  docRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  map: { height: 300, borderRadius: 24 },
  mapChip: { position: "absolute", left: 12, bottom: 12 },
});
