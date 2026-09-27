import { Text } from "@relife/ui";
import { View } from "react-native";

import { Screen } from "./Screen";

/** Temporary content for routes whose feature has not been built yet. */
export function PlaceholderScreen({ title, sprint }: { title: string; sprint?: string }) {
  return (
    <Screen>
      <View className="gap-2">
        <Text variant="title">{title}</Text>
        {sprint && <Text color="textSecondary">Coming in {sprint}</Text>}
        <View className="mt-4 self-start rounded-md bg-primary px-3 py-1">
          <Text variant="label" color="onPrimary">
            Tailwind is working
          </Text>
        </View>
      </View>
    </Screen>
  );
}
