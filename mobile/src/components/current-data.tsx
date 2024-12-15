import { Droplets, Thermometer, WindArrowDown } from "lucide-react-native";
import { Text, View } from "react-native";
import { formatNumber } from "../utils/format-number";
import { useCurrentData } from "../utils/use-current-data";
import DataCard from "./data-card";

export default function CurrentData() {
  const data = useCurrentData();

  if (!data) return null;

  return (
    <View className="flex-col gap-4">
      <Text className="text-sm">
        Data z: {data.timestamp.toLocaleString("cs-CZ")}
      </Text>
      <DataCard
        className="border-red-700/30 bg-red-700/20"
        icon={Thermometer}
        title="Teplota"
        value={`${formatNumber(data.temperature)} °C`}
      />
      <DataCard
        className="border-sky-600/40 bg-sky-600/15"
        icon={Droplets}
        title="Vlhkost"
        value={`${formatNumber(data.humidity)} %`}
      />
      <DataCard
        className="border-amber-500/45 bg-amber-500/25"
        icon={WindArrowDown}
        title="Tlak"
        value={`${formatNumber(data.pressure / 100)} hPa`}
      />
    </View>
  );
}
