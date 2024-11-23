import { useEffect, useState } from "react";
import { DeviceId } from "react-native-ble-plx";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BleProvider } from "./components/ble-context";
import DataPage from "./pages/data";
import PairPage from "./pages/pair";
import { getPairedDevice } from "./utils/pairing";

export default function App() {
  const [device, setDevice] = useState<DeviceId | null | undefined>(undefined);

  useEffect(() => {
    getPairedDevice().then(setDevice);
  }, []);

  if (device === undefined) return null;

  return (
    <SafeAreaProvider>
      <BleProvider>{!device ? <PairPage /> : <DataPage />}</BleProvider>
    </SafeAreaProvider>
  );
}
