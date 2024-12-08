import { usePairedDevice } from "../utils/pairing";
import DataPage from "./data";
import PairPage from "./pair";

export default function WrapperPage() {
  const deviceId = usePairedDevice();
  if (deviceId === undefined) return null;
  return !deviceId ? <PairPage /> : <DataPage />;
}
