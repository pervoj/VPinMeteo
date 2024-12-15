import { LucideIcon } from "lucide-react-native";
import { ComponentProps } from "react";
import { Text, View } from "react-native";
import { cn } from "../utils/cn";

const colorVariants = {
  info: "border-sky-600/40 bg-sky-600/15",
  warning: "border-amber-500/45 bg-amber-500/25",
  error: "border-red-700/30 bg-red-700/20",
};

export function Banner({
  className,
  variant = "info",
  ...props
}: ComponentProps<typeof View> & { variant?: keyof typeof colorVariants }) {
  return (
    <View
      className={cn(
        "flex-col gap-2 rounded-xl border-2 p-2",
        colorVariants[variant],
        className,
      )}
      {...props}
    />
  );
}

export function BannerHeader({
  icon: Icon,
  title,
  className,
}: {
  icon?: LucideIcon;
  title?: string;
  className?: string;
}) {
  return (
    <View className={cn("flex-row items-center gap-1.5", className)}>
      {Icon && <Icon size={24} color="black" />}
      {title && <Text className="text-lg font-bold">{title}</Text>}
    </View>
  );
}

export function BannerContent({
  className,
  ...props
}: ComponentProps<typeof View>) {
  return <View className={cn("flex-col gap-1", className)} {...props} />;
}
