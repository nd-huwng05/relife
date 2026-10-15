import { ActivityIndicator, StyleSheet, View } from "react-native";

import { Icon, type IconName } from "../icons";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { Button } from "./Button";
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

export function LoadingView({ label = "Đang tải…" }: { label?: string }) {
  return (
    <View style={styles.wrap} accessibilityLabel={label}>
      <ActivityIndicator color={colors.forest} />
      <Text variant="caption" color="stone">
        {label}
      </Text>
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
});
