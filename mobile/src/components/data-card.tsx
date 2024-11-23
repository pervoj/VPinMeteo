import { LucideIcon } from "lucide-react-native";
import { Text, View } from "react-native";
import { cn } from "../utils/cn";

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
  return (
    <View
      className={cn(
        "relative flex-row items-center gap-4 rounded-3xl border-2 border-black/20 p-6",
        className,
      )}
    >
      <Icon color="black" size={72} />
      <View className="flex-col gap-1">
        <Text className="text-lg font-bold">{title}</Text>
        <Text className="text-4xl font-bold">{value}</Text>
      </View>
    </View>
  );
}
