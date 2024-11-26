import { LucideIcon } from "lucide-react-native";
import { Text, View } from "react-native";
import { cn } from "../utils/cn";
import { useIconColor } from "../utils/use-icon-color";

export default function DataCard({
  className,
  title,
  value,
  icon: Icon,
}: {
  className?: string;
  title: string;
  value: string;
  icon: LucideIcon;
}) {
  const iconColor = useIconColor();

  return (
    <View
      className={cn(
        "relative flex-row items-center gap-4 rounded-3xl border-2 border-black/20 p-6",
        className,
      )}
    >
      <Icon color={iconColor} size={72} />
      <View className="flex-col gap-1">
        <Text className="text-lg font-bold text-neutral-950 dark:text-neutral-100">
          {title}
        </Text>
        <Text className="text-4xl font-bold text-neutral-950 dark:text-neutral-100">
          {value}
        </Text>
      </View>
    </View>
  );
}
