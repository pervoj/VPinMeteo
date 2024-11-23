import { Bluetooth } from "lucide-react-native";
import { Text } from "react-native";
import { useBle } from "../components/ble-context";
import BluetoothState from "../components/bluetooth-state";
import DeviceList from "../components/device-list";
import Layout from "../components/layout";

export default function PairPage() {
  const { state } = useBle();

  return (
    <Layout title="Párování" icon={Bluetooth}>
      <Text className="text-lg leading-normal">
        Pro používání aplikace je nutné ji nejdříve spárovat se zařízením{" "}
        <Text className="font-bold">VPinMeteo</Text>. Vyberte zařízení níže.
      </Text>

      <BluetoothState>
        <DeviceList />
      </BluetoothState>
    </Layout>
  );
}
