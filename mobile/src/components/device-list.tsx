import { useCallback, useEffect, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { Device } from "react-native-ble-plx";
import {
  getServiceAndCharacteristic,
  listenForMessage,
} from "../utils/bluetooth";
import { useBleManager } from "./ble-context";

export default function DeviceList() {
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
    Alert.alert("Device", device.id);

    device.connect().then((device) => {
      device.isConnected().then((connected) => {
        console.log("\nLoading device", device.id, connected);
        if (!connected) return;

        getServiceAndCharacteristic(device).then((res) => {
          listenForMessage(device, res!, (message) => {
            console.log("Message received", message);
          });

          device.writeCharacteristicWithoutResponseForService(
            res!.service,
            res!.characteristic,
            btoa("data;"),
          );
        });
      });
    });
  }, []);

  return (
    <View className="flex-col gap-2">
      {Object.values(devices).map((device) => (
        <Pressable
          key={device.id}
          onPress={() => chooseDevice(device)}
          className="gap-1 rounded-xl border-2 border-black/20 p-2"
        >
          <Text className="text-lg font-medium">{device.name}</Text>
          <Text className="text-sm">{device.id}</Text>
        </Pressable>
      ))}
    </View>
  );
}
