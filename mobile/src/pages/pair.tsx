import { Bluetooth } from "lucide-react-native";
import { Text } from "react-native";
import { DeviceId } from "react-native-ble-plx";
import BluetoothState from "../components/bluetooth-state";
import DeviceList from "../components/device-list";
import Layout from "../components/layout";

export default function PairPage({
  onPaired,
}: {
  onPaired?: (device: DeviceId) => void;
}) {
  return (
    <Layout title="Párování" icon={Bluetooth}>
      <Text className="text-lg leading-normal text-neutral-950 dark:text-neutral-100">
        Pro používání aplikace je nutné ji nejdříve spárovat se zařízením{" "}
        <Text className="font-bold">VPinMeteo</Text>. Vyberte zařízení níže.
      </Text>

      <BluetoothState>
        <DeviceList onPaired={onPaired} />
      </BluetoothState>
    </Layout>
  );
}
