import { StatusBar } from "expo-status-bar";
import { LucideIcon } from "lucide-react-native";
import { ReactNode } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useIconColor } from "../utils/use-icon-color";

export default function Layout({
  title,
  icon: Icon,
  children,
  headerSuffix,
}: {
  title: string;
  icon: LucideIcon;
  children?: ReactNode;
  headerSuffix?: ReactNode;
}) {
  const iconColor = useIconColor();
  const { top, bottom, left, right } = useSafeAreaInsets();

  return (
    <View
      className="flex-1 flex-col"
      style={{ paddingBottom: bottom, paddingLeft: left, paddingRight: right }}
    >
      <View
        style={{ paddingTop: top }}
        className="border-b-2 border-black/10 bg-black/5 dark:border-white/5 dark:bg-white/10"
      >
        <View className="flex-row items-center gap-1 px-6 py-4">
          <Icon size={32} color={iconColor} />
          <View className="flex-col gap-0.5">
            <Text className="text-xs leading-none text-neutral-950 dark:text-neutral-100">
              VPinMeteo
            </Text>
            <Text className="text-3xl font-bold leading-none text-neutral-950 dark:text-neutral-100">
              {title}
            </Text>
          </View>
          <View className="ms-auto flex-row items-center gap-1">
            {headerSuffix}
          </View>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <View className="flex-1 gap-6 p-6">{children}</View>
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}
