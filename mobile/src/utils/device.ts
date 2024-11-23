import { useEffect, useState } from "react";
import { BleError, type Device, type DeviceId } from "react-native-ble-plx";
import { useBleManager } from "../components/ble-context";
import { getPairedDevice } from "./pairing";

export function useDevice() {
  const bleManager = useBleManager();

  const [id, setId] = useState<DeviceId | null | undefined>(undefined);
  const [device, setDevice] = useState<Device | undefined>(undefined);
  const [error, setError] = useState<BleError | undefined>(undefined);

  const isPaired = id === undefined ? undefined : !!id;

  useEffect(() => {
    getPairedDevice().then(setId);
  }, []);

  useEffect(() => {
    if (!id || device) return;
    bleManager
      .connectToDevice(id)
      .then((device) => {
        setError(undefined);
        setDevice(device);
      })
      .catch((error) => {
        setError(error);
        setDevice(undefined);
      });
  }, [id, device]);

  useEffect(() => {
    if (!device) return;
    const sub = device.onDisconnected((error) => {
      setError(error ?? undefined);
      setDevice(undefined);
    });
    return () => sub.remove();
  }, [device]);

  return { isPaired, deviceId: id, device, error };
}
