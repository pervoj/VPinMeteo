import AsyncStorage from "@react-native-async-storage/async-storage";
import { type DeviceId } from "react-native-ble-plx";

const PAIRED_KEY = "bluetoothPairedDevice";
type PairedValue = { id: DeviceId };

export async function setPairedDevice(id: DeviceId) {
  const data = JSON.stringify({ id } satisfies PairedValue);
  return await AsyncStorage.setItem(PAIRED_KEY, data);
}

export async function getPairedDevice() {
  const data = await AsyncStorage.getItem(PAIRED_KEY);
  const value = data ? (JSON.parse(data) as PairedValue) : undefined;
  return value?.id ?? null;
}
