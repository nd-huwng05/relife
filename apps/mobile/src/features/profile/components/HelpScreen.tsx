import { Button, Card, Icon, Overline, StateView, Text, colors, fontFamily } from "@relife/ui";
import { useState } from "react";
import { Linking, Pressable, StyleSheet, TextInput, View } from "react-native";

import { BottomBar } from "@/components/BottomBar";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";

import { helpContent } from "../api";

/** A30 Help And FAQ. */
export function HelpScreen() {
  const [open, setOpen] = useState(0);
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const faq = helpContent.faq.filter((f) => !q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));

  return (
    <Screen
      gap={10}
      header={<ScreenHeader title="Trợ giúp" />}
      footer={
        <BottomBar plain>
          {/* TODO(S8): open the in-app support chat. */}
          <Button title="Chat với hỗ trợ Relife" icon="msg" variant="white" onPress={() => Linking.openURL("mailto:hotro@relife.vn")} />
        </BottomBar>
      }
    >
      <View style={styles.search}>
        <Icon name="search" size={20} color="stone" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Tìm câu hỏi…"
          placeholderTextColor={colors.sand}
          style={styles.input}
          accessibilityLabel="Tìm câu hỏi"
        />
      </View>
      <Overline>CÂU HỎI THƯỜNG GẶP</Overline>
      {faq.length === 0 && <StateView icon="help" title="Chưa có câu trả lời" message="Thử từ khoá khác hoặc chat với Relife." />}
      {faq.map((f, i) => {
        const expanded = open === i;
        return (
          <Card key={f.q} gap={10} style={expanded && styles.open}>
            <Pressable accessibilityRole="button" accessibilityState={{ expanded }} onPress={() => setOpen(expanded ? -1 : i)} style={styles.q}>
              <Text variant="bodyStrong" style={[styles.flex, !expanded && styles.closedQ]}>
                {f.q}
              </Text>
              <Icon name={expanded ? "down" : "right"} size={18} color="ink" />
            </Pressable>
            {expanded && (
              <Text style={styles.answer}>{f.a}</Text>
            )}
          </Card>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: {
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 18,
  },
  input: { flex: 1, height: "100%", fontFamily: fontFamily.body, fontSize: 15, color: colors.ink },
  q: { flexDirection: "row", alignItems: "center", gap: 10 },
  flex: { flex: 1 },
  open: { backgroundColor: colors.white, borderColor: colors.forest },
  closedQ: { fontFamily: fontFamily.bodyMedium },
  answer: { fontFamily: fontFamily.body, fontSize: 14, lineHeight: 21, color: colors.stone },
});
