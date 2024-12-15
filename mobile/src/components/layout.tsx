import { StatusBar } from "expo-status-bar";
import { LucideIcon } from "lucide-react-native";
import { ReactNode, useEffect, useRef, useState } from "react";
import { ScrollView, Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const headerRef = useRef<View>(null);
  const [headerHeight, setHeaderHeight] = useState<number>();
  const screenHeight = useWindowDimensions().height;
  const { top, bottom, left, right } = useSafeAreaInsets();

  useEffect(() => {
    headerRef.current?.measureInWindow((_, __, ___, h) => {
      setHeaderHeight(h);
    });
  }, []);

  return (
    <View className="flex-1 flex-col" style={{ height: screenHeight }}>
      <View
        ref={headerRef}
        style={{ paddingTop: top }}
        className="border-b-2 border-black/10 bg-black/5"
      >
        <View className="flex-row items-center gap-1 px-6 py-4">
          <Icon size={32} color="black" />
          <View className="flex-col gap-0.5">
            <Text className="text-xs leading-none">VPinMeteo</Text>
            <Text className="text-3xl font-bold leading-none">{title}</Text>
          </View>
          <View className="ms-auto flex-row items-center gap-1">
            {headerSuffix}
          </View>
        </View>
      </View>
      <ScrollView
        style={{
          flex: 1,
          height: headerHeight ? screenHeight - headerHeight : undefined,
        }}
        contentContainerStyle={{
          paddingBottom: bottom,
          paddingLeft: left,
          paddingRight: right,
        }}
      >
        <View className="gap-4 p-6">{children}</View>
      </ScrollView>
      <StatusBar style="inverted" />
    </View>
  );
}
