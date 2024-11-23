import {
  Droplets,
  Home,
  Thermometer,
  WindArrowDown,
} from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { State } from "react-native-ble-plx";
import { useBleState } from "../components/ble-context";
import BluetoothState from "../components/bluetooth-state";
import DataCard from "../components/data-card";
import Layout from "../components/layout";
import { listenForCommand } from "../utils/bluetooth";
import { useDevice } from "../utils/device";

type Result = {
  humidity: number;
  temperature: number;
  pressure: number;
};

export default function DataPage() {
  const state = useBleState();
  const { device } = useDevice();

  const [data, setData] = useState<Result | undefined>(undefined);

  const cb: Parameters<typeof listenForCommand>[1] = useCallback(
    ({ command, data }) => {
      if (command != "data") return;
      const values = data!.map(parseFloat);
      setData({
        humidity: values[0],
        temperature: values[1],
        pressure: values[2],
      });
    },
    [],
  );

  useEffect(() => {
    if (!device) return;
    listenForCommand(device, cb);
  }, [device]);

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
        state == State.PoweredOn &&
        (!device || !data) && (
          <View className="flex-row items-center justify-center gap-2">
            <ActivityIndicator />
            <Text>{!device ? "Připojování" : "Načítání"}</Text>
          </View>
        )
      }
    >
      <BluetoothState>
        {device && data && (
          <View className="flex-col gap-4">
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
    </Layout>
  );
}
