import { desc, eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import {
  Droplets,
  Home,
  Thermometer,
  WindArrowDown,
} from "lucide-react-native";
import { useCallback, useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { State } from "react-native-ble-plx";
import { useBleState } from "../components/ble-context";
import BluetoothState from "../components/bluetooth-state";
import DataCard from "../components/data-card";
import Layout from "../components/layout";
import { db } from "../db";
import { values } from "../db/schema";
import { listenForCommand } from "../utils/bluetooth";
import { useDevice } from "../utils/device";
import { useIconColor } from "../utils/use-icon-color";

export default function DataPage() {
  const iconColor = useIconColor();
  const state = useBleState();
  const { device } = useDevice();

  const { data } = useLiveQuery(
    db.query.values.findFirst({
      orderBy: desc(values.timestamp),
    }),
  );

  const cb: Parameters<typeof listenForCommand>[1] = useCallback(
    async ({ command, data }) => {
      if (command != "data") return;
      const dataValues = data!.map(parseFloat);

      const valueAge = dataValues[0] - dataValues[1];
      const timestamp = Date.now() - valueAge;
      const date = new Date(timestamp);
      date.setMilliseconds(0);

      const items = await db
        .select({ id: values.id })
        .from(values)
        .where(eq(values.timestamp, date));

      if (items.length) return;

      await db.insert(values).values({
        humidity: dataValues[2],
        temperature: dataValues[3],
        pressure: dataValues[4],
        timestamp: date,
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
            <ActivityIndicator color={iconColor} />
            <Text className="text-neutral-950 dark:text-neutral-100">
              {!device ? "Připojování" : "Načítání"}
            </Text>
          </View>
        )
      }
    >
      <BluetoothState>
        {device && data && (
          <View className="flex-col gap-4">
            <Text className="text-sm text-neutral-950 dark:text-neutral-100">
              Data z: {data.timestamp.toLocaleString("cs-CZ")}
            </Text>
            <DataCard
              className="border-red-700/30 bg-red-700/20 dark:border-red-500/30 dark:bg-red-500/20"
              icon={Thermometer}
              title="Teplota"
              value={`${formatNumber(data.temperature)} °C`}
            />
            <DataCard
              className="border-sky-600/40 bg-sky-600/15 dark:border-sky-400/40 dark:bg-sky-400/15"
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
