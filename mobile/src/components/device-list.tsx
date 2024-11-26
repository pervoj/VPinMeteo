import { useCallback, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Device, DeviceId } from "react-native-ble-plx";
import { setPairedDevice } from "../utils/pairing";
import { useBleManager } from "./ble-context";

export default function DeviceList({
  onPaired,
}: {
  onPaired?: (device: DeviceId) => void;
}) {
  const bleManager = useBleManager();
  const [devices, setDevices] = useState<Record<string, Device>>({});

  useEffect(() => {
    bleManager.startDeviceScan(
      null,
      { allowDuplicates: false },
      (error, device) => {
        if (error) {
          console.error(error, JSON.stringify(error, null, 2));
          return;
        }

        if (!device) return;
        if (device.name?.toLocaleLowerCase() != "vpinmeteo") return;

        setDevices((prev) => ({ ...prev, [device.id]: device }));
      },
    );
  }, []);

  const chooseDevice = useCallback((device: Device) => {
    setPairedDevice(device.id).then(() => {
      onPaired?.(device.id);
    });
  }, []);

  return (
    <View className="flex-col gap-2">
      {Object.values(devices).map((device) => (
        <Pressable
          key={device.id}
          onPress={() => chooseDevice(device)}
          className="gap-1 rounded-xl border-2 border-black/20 p-2 dark:border-white/30"
        >
          <Text className="text-lg font-medium text-neutral-950 dark:text-neutral-100">
            {device.name}
          </Text>
          <Text className="text-sm text-neutral-950 dark:text-neutral-100">
            {device.id}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
