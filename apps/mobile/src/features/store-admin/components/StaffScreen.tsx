import { STAFF_ROLE, inviteStaffSchema, type InviteStaffInput, type StaffRole } from "@relife/shared";
import { Avatar, Button, Card, Divider, Icon, KeyValueRow, LoadingView, SelectChip, StatusBadge, Text, TextField, type StatusTone } from "@relife/ui";
import { Fragment, useState } from "react";
import { StyleSheet, View } from "react-native";

import { BottomBar } from "@/components/BottomBar";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { errorMessage } from "@/lib/queryClient";

import { useInviteStaff, useStaff } from "../hooks/useStoreAdmin";

const ROLE_VIEW: Record<StaffRole, { label: string; tone: StatusTone; rights: string }> = {
  [STAFF_ROLE.OWNER]: { label: "Chủ tiệm", tone: "success", rights: "Toàn quyền" },
  [STAFF_ROLE.MANAGER]: { label: "Quản lý", tone: "neutral", rights: "Đăng túi, xem doanh thu" },
  [STAFF_ROLE.COUNTER]: { label: "Quầy", tone: "neutral", rights: "Chỉ quét mã và xem đơn" },
};

/** B23 Staff Accounts. Permissions are enforced on the server, not only by hiding buttons. */
export function StaffScreen() {
  const query = useStaff();
  const invite = useInviteStaff();
  const [inviting, setInviting] = useState(false);
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<InviteStaffInput["role"]>(STAFF_ROLE.COUNTER);
  const valid = inviteStaffSchema.safeParse({ phone, role }).success;

  if (!query.data) return <LoadingView />;

  return (
    <Screen
      gap={12}
      header={<ScreenHeader title="Nhân viên" />}
      footer={
        <BottomBar plain>
          {invite.isError && (
            <Text variant="caption" color="terracotta" align="center">
              {errorMessage(invite.error)}
            </Text>
          )}
          {inviting ? (
            <Button
              title="Gửi lời mời"
              disabled={!valid}
              loading={invite.isPending}
              onPress={() => invite.mutate({ phone, role }, { onSuccess: () => { setInviting(false); setPhone(""); } })}
            />
          ) : (
            <Button title="Mời nhân viên" icon="plus" onPress={() => setInviting(true)} />
          )}
        </BottomBar>
      }
    >
      <Card gap={12}>
        {query.data.map((m, i) => {
          const v = ROLE_VIEW[m.role];
          return (
            <Fragment key={m.id}>
              {i > 0 && <Divider />}
              <View style={styles.row}>
                <Avatar name={m.name} size={40} tone="linen" />
                <View style={styles.flex}>
                  <Text variant="bodyStrong">{m.isMe ? `${m.name} (bạn)` : m.name}</Text>
                  <Text variant="caption" color="stone">
                    +84 {m.phone.replace(/(\d{3})(?=\d)/g, "$1 ")}
                  </Text>
                </View>
                <StatusBadge label={v.label} tone={v.tone} />
              </View>
            </Fragment>
          );
        })}
      </Card>

      {inviting && (
        <Card gap={12}>
          <TextField label="Số điện thoại nhân viên" prefix="+84" value={phone} onChangeText={(t) => setPhone(t.replace(/\D/g, ""))} keyboardType="phone-pad" autoFocus />
          <Text variant="label" color="stone">
            Vai trò
          </Text>
          <View style={styles.chips}>
            <SelectChip label="Quản lý" selected={role === STAFF_ROLE.MANAGER} onPress={() => setRole(STAFF_ROLE.MANAGER)} />
            <SelectChip label="Quầy" selected={role === STAFF_ROLE.COUNTER} onPress={() => setRole(STAFF_ROLE.COUNTER)} />
          </View>
        </Card>
      )}

      <Card gap={10}>
        <Text variant="bodyStrong" style={styles.t14}>
          Quyền theo vai trò
        </Text>
        {Object.values(ROLE_VIEW).map((v) => (
          <KeyValueRow key={v.label} label={v.label} value={v.rights} />
        ))}
        <View style={styles.note}>
          <Icon name="lock" size={14} color="stone" />
          <Text variant="caption" color="stone">
            Quyền được kiểm tra ở máy chủ, không chỉ ẩn nút.
          </Text>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  flex: { flex: 1, gap: 2 },
  chips: { flexDirection: "row", gap: 8 },
  t14: { fontSize: 14, lineHeight: 18 },
  note: { flexDirection: "row", alignItems: "center", gap: 6 },
});
