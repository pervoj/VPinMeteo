import { Home } from "lucide-react-native";
import { ActivityIndicator, Text, View } from "react-native";
import { State } from "react-native-ble-plx";
import { useBleState } from "../components/ble-context";
import BluetoothState from "../components/bluetooth-state";
import CurrentData from "../components/current-data";
import Layout from "../components/layout";
import Stats from "../components/stats";
import { useDevice } from "../utils/device";
import { useDataListener } from "../utils/use-data-listener";

export default function DataPage() {
  const state = useBleState();
  const { device } = useDevice();

  useDataListener(device);

  return (
    <Layout
      title="Domů"
      icon={Home}
      headerSuffix={
        <>
          {state == State.PoweredOn && !device && (
            <View className="flex-row items-center justify-center gap-2">
              <ActivityIndicator color="black" />
              <Text>Připojování</Text>
            </View>
          )}
        </>
      }
    >
      <BluetoothState />
      <CurrentData />
      <Stats />
    </Layout>
  );
}
