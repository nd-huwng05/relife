import { Avatar, Icon, LoadingView, StateView, Text, colors, fontFamily } from "@relife/ui";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { Screen } from "@/components/Screen";
import { BagRow, formatKm } from "@/features/bags";

import { normalize } from "../api";
import { useRecentSearches, useSearch } from "../hooks/useDiscover";

/** A10 Search. Works without Vietnamese accents ("banh mi" finds "bánh mì"). */
export function SearchScreen() {
  const [query, setQuery] = useState("");
  const recent = useRecentSearches();
  const results = useSearch(query);
  const q = query.trim();
  const noAccents = q.length > 0 && normalize(q) === q.toLowerCase();

  return (
    <Screen
      gap={14}
      header={
        <View style={styles.header}>
          <View style={styles.field}>
            <Icon name="search" size={20} color="stone" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              autoFocus
              placeholder="Tìm tiệm bánh, món bánh…"
              placeholderTextColor={colors.sand}
              returnKeyType="search"
              selectionColor={colors.forest}
              style={styles.input}
              accessibilityLabel="Tìm kiếm"
            />
          </View>
          <Pressable accessibilityRole="button" onPress={() => router.back()} hitSlop={8}>
            <Text style={styles.cancel}>Huỷ</Text>
          </Pressable>
        </View>
      }
    >
      {(recent.data ?? []).length > 0 && (
        <View style={styles.recent}>
          <Text style={styles.overline}>TÌM GẦN ĐÂY</Text>
          <View style={styles.chips}>
            {(recent.data ?? []).map((r) => (
              <Pressable key={r} accessibilityRole="button" onPress={() => setQuery(r)} style={styles.chip}>
                <Icon name="clock" size={15} color="ink" />
                <Text style={styles.chipText}>{r}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {q.length > 0 &&
        (results.isPending ? (
          <LoadingView label="Đang tìm…" />
        ) : results.data && results.data.stores.length + results.data.bags.length === 0 ? (
          <StateView icon="search" title="Chưa có kết quả" message={`Không tìm thấy “${q}” quanh bạn tối nay.`} />
        ) : (
          <>
            {noAccents && (
              <View style={styles.note}>
                <Icon name="info" size={16} color="amber" />
                <Text style={styles.noteText}>Kết quả cho “{q}” gồm cả từ có dấu, không cần gõ dấu.</Text>
              </View>
            )}
            {results.data && results.data.stores.length > 0 && (
              <>
                <Text style={styles.section}>Tiệm</Text>
                {results.data.stores.map((s) => (
                  <Pressable key={s.id} accessibilityRole="button" onPress={() => router.push(`/store/${s.id}`)} style={styles.storeRow}>
                    <Avatar name={s.name} size={48} tone="dark" />
                    <View style={styles.flex}>
                      <Text style={styles.storeName}>{s.name}</Text>
                      <Text style={styles.storeMeta}>
                        {s.category} · {s.bagsToday} túi hôm nay · {formatKm(s.distanceKm)}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </>
            )}
            {results.data && results.data.bags.length > 0 && (
              <>
                <Text style={styles.section}>
                  Túi bánh · <Text style={styles.sectionNumber}>{results.data.bags.length}</Text> kết quả
                </Text>
                {results.data.bags.map((b) => (
                  <BagRow key={b.id} bag={b} onPress={() => router.push(`/bag/${b.id}`)} />
                ))}
              </>
            )}
          </>
        ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: 16, paddingHorizontal: 24, paddingTop: 4, paddingBottom: 10 },
  field: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.forest,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingLeft: 18,
    paddingRight: 14,
  },
  input: { flex: 1, height: "100%", fontFamily: fontFamily.bodyMedium, fontSize: 16, color: colors.ink },
  cancel: { fontFamily: fontFamily.bodySemiBold, fontSize: 15, color: colors.forest },
  recent: { gap: 10 },
  overline: { fontFamily: fontFamily.bodySemiBold, fontSize: 11, letterSpacing: 1.32, color: colors.stone },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
  },
  chipText: { fontFamily: fontFamily.bodyMedium, fontSize: 13, color: colors.ink },
  note: { flexDirection: "row", gap: 8, alignItems: "flex-start" },
  noteText: { flex: 1, fontFamily: fontFamily.body, fontSize: 13, color: colors.stone },
  section: { fontFamily: fontFamily.heading, fontSize: 17, color: colors.ink },
  sectionNumber: { fontFamily: fontFamily.number, fontSize: 16 },
  storeRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  flex: { flex: 1, gap: 3 },
  storeName: { fontFamily: fontFamily.bodySemiBold, fontSize: 15, color: colors.ink },
  storeMeta: { fontFamily: fontFamily.body, fontSize: 13, color: colors.stone },
});
