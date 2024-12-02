import { type DeviceId } from "react-native-ble-plx";
import { getKeyValValue, setKeyValValue, useKeyValValue } from "./keyval";

const PAIRED_KEY = "bluetoothPairedDevice";
type PairedValue = { id: DeviceId };

export async function setPairedDevice(id: DeviceId) {
  const data = JSON.stringify({ id } satisfies PairedValue);
  return await setKeyValValue(PAIRED_KEY, data);
}

export async function getPairedDevice() {
  const data = await getKeyValValue(PAIRED_KEY);
  const value = data ? (JSON.parse(data) as PairedValue) : undefined;
  return value?.id ?? null;
}

export function usePairedDevice() {
  const data = useKeyValValue(PAIRED_KEY);
  const value = data ? (JSON.parse(data) as PairedValue) : undefined;
  return value?.id ?? null;
}
