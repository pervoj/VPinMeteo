import {
  Droplets,
  Home,
  Thermometer,
  WindArrowDown,
} from "lucide-react-native";
import { ActivityIndicator, Text, View } from "react-native";
import { State } from "react-native-ble-plx";
import { useBleState } from "../components/ble-context";
import BluetoothState from "../components/bluetooth-state";
import DataCard from "../components/data-card";
import Layout from "../components/layout";
import Stats from "../components/stats";
import { useDevice } from "../utils/device";
import { useCurrentData } from "../utils/use-current-data";
import { useDataListener } from "../utils/use-data-listener";

export default function DataPage() {
  const state = useBleState();
  const { device } = useDevice();

  useDataListener(device);
  const data = useCurrentData();

  function formatNumber(value: number) {
    return value.toLocaleString("cs-CZ", {
      maximumFractionDigits: 1,
    });
  }

  return (
    <Layout
      title="Domů"
      icon={Home}
      headerSuffix={
        <>
          {state == State.PoweredOn && (!device || !data) && (
            <View className="flex-row items-center justify-center gap-2">
              <ActivityIndicator color="black" />
              <Text>{!device ? "Připojování" : "Načítání"}</Text>
            </View>
          )}
        </>
      }
    >
      <BluetoothState>
        {device && data && (
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
        )}
      </BluetoothState>
      <Stats />
    </Layout>
  );
}
