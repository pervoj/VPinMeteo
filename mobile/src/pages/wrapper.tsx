import { useEffect, useState } from "react";
import { DeviceId } from "react-native-ble-plx";
import { getPairedDevice } from "../utils/pairing";
import DataPage from "./data";
import PairPage from "./pair";

export default function WrapperPage() {
  const [device, setDevice] = useState<DeviceId | null | undefined>(undefined);

  useEffect(() => {
    getPairedDevice().then(setDevice);
  }, []);

  if (device === undefined) return null;

  return !device ? <PairPage onPaired={setDevice} /> : <DataPage />;
}
