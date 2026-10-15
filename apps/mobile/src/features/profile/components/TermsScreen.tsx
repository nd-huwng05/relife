import { Card, Divider, Icon, IconButton, ListRow, Overline, Text, colors, fontFamily } from "@relife/ui";
import { Linking, StyleSheet, View } from "react-native";

import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";

import { helpContent } from "../api";

/** A32 Terms And Privacy. The same public links are used on the App Store and Google Play. */
export function TermsScreen() {
  return (
    <Screen gap={12} header={<ScreenHeader title="Điều khoản và quyền riêng tư" />}>
      <Text style={styles.intro}>Cùng một đường dẫn công khai được dùng trên App Store và Google Play.</Text>
      {helpContent.legal.map((d) => (
        <Card key={d.url} padding={14} onPress={() => Linking.openURL(d.url)} accessibilityLabel={d.title}>
          <View style={styles.row}>
            <IconButton name="file" size={40} iconSize={18} variant="soft" accessibilityLabel="" />
            <View style={styles.flex}>
              <Text variant="bodyStrong">{d.title}</Text>
              <Text variant="caption" color="stone">
                Cập nhật {d.updated} · {d.url.replace("https://", "")}
              </Text>
            </View>
            <Icon name="share" size={16} color="ink" />
          </View>
        </Card>
      ))}
      <Overline>DỮ LIỆU CỦA BẠN</Overline>
      <Card gap={12}>
        {/* TODO(S8): request a data export from the server. */}
        <ListRow icon="file" title="Tải bản sao dữ liệu" subtitle="Gửi về email trong 48 giờ" onPress={() => Linking.openURL("mailto:hotro@relife.vn?subject=Yêu cầu bản sao dữ liệu")} />
        <Divider />
        <ListRow icon="lock" title="Quyền vị trí" value="Khi dùng app" onPress={() => Linking.openSettings()} />
      </Card>
      <Text variant="caption" color="stone" align="center">
        {helpContent.version}
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  flex: { flex: 1, gap: 2 },
  intro: { fontFamily: fontFamily.body, fontSize: 14, lineHeight: 20, color: colors.stone },
});
