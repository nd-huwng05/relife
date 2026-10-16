import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { Icon, type IconName } from "../icons";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { Button } from "./Button";
import { Skeleton } from "./Skeleton";
import { Text } from "./Text";

export interface StateViewProps {
  icon?: IconName;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

/** Empty or error state: soft round icon, title, message and an optional action. */
export function StateView({ icon = "info", title, message, actionLabel, onAction }: StateViewProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.hero}>
        <Icon name={icon} size={30} color="forest" />
      </View>
      <Text variant="section" align="center">
        {title}
      </Text>
      {message && (
        <Text variant="small" color="stone" align="center">
          {message}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button title={actionLabel} variant="secondary" size="md" fullWidth={false} onPress={onAction} style={styles.action} />
      )}
    </View>
  );
}

/** Fast loads never flash a placeholder (E01). */
const SHOW_AFTER_MS = 200;
/** After this the wait is treated as a failure and the user gets a way out (E01). */
const TIMEOUT_MS = 10_000;

export interface LoadingViewProps {
  /** Read by screen readers. */
  label?: string;
  /** Shape of the placeholder: Discover feed (E01), a list of rows, or a detail page. */
  variant?: "feed" | "list" | "detail";
  /** Shown as "Thử lại" when loading takes longer than 10 seconds. */
  onRetry?: () => void;
}

function SkeletonRow() {
  return (
    <View style={styles.row}>
      <Skeleton width={64} height={64} radius={14} />
      <View style={styles.rowText}>
        <Skeleton width="85%" height={14} radius={6} />
        <Skeleton width="55%" height={12} radius={6} />
        <Skeleton width="40%" height={12} radius={6} />
      </View>
    </View>
  );
}

export function SkeletonList({ rows = 3 }: { rows?: number }) {
  return (
    <View style={styles.list}>
      {Array.from({ length: rows }, (_, i) => (
        <SkeletonRow key={i} />
      ))}
    </View>
  );
}

function FeedSkeleton() {
  return (
    <View style={styles.feed}>
      <Skeleton width={140} height={22} />
      <View style={styles.strip}>
        {[0, 1].map((i) => (
          <View key={i} style={styles.tile}>
            <Skeleton width={212} height={124} radius={16} />
            <Skeleton width={150} height={14} radius={6} />
            <Skeleton width={90} height={14} radius={6} />
          </View>
        ))}
      </View>
      <Skeleton height={110} radius={22} />
    </View>
  );
}

function DetailSkeleton() {
  return (
    <View style={styles.feed}>
      <Skeleton height={220} radius={22} />
      <Skeleton width="70%" height={28} />
      <Skeleton width="45%" height={16} radius={6} />
      <Skeleton height={78} radius={22} />
      <Skeleton height={110} radius={22} />
    </View>
  );
}

/**
 * Loading placeholder (E01): nothing for the first 200 ms, then skeleton blocks in the shape
 * of the content, then a timeout message after 10 seconds.
 */
export function LoadingView({ label = "Đang tải…", variant = "list", onRetry }: LoadingViewProps) {
  const [phase, setPhase] = useState<"hidden" | "skeleton" | "slow">("hidden");

  useEffect(() => {
    const show = setTimeout(() => setPhase("skeleton"), SHOW_AFTER_MS);
    const slow = setTimeout(() => setPhase("slow"), TIMEOUT_MS);
    return () => {
      clearTimeout(show);
      clearTimeout(slow);
    };
  }, []);

  if (phase === "slow") {
    return (
      <StateView
        icon="wifioff"
        title="Tải lâu hơn bình thường"
        message="Mạng có thể đang chậm. Kiểm tra kết nối rồi thử lại."
        actionLabel={onRetry ? "Thử lại" : undefined}
        onAction={onRetry}
      />
    );
  }

  return (
    <View accessible accessibilityLabel={label} accessibilityRole="progressbar" style={phase === "hidden" ? styles.hidden : undefined}>
      {variant === "feed" ? <FeedSkeleton /> : variant === "detail" ? <DetailSkeleton /> : <SkeletonList />}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center", gap: spacing.xs, paddingVertical: spacing.xl, paddingHorizontal: spacing.lg },
  hero: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.goldSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  action: { alignSelf: "center", marginTop: spacing.xs },
  hidden: { opacity: 0 },
  list: { gap: 10, paddingVertical: spacing.sm },
  row: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    padding: 12,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
  },
  rowText: { flex: 1, gap: 8 },
  feed: { gap: 16, paddingVertical: spacing.sm },
  strip: { flexDirection: "row", gap: 12, overflow: "hidden" },
  tile: { gap: 10 },
});
