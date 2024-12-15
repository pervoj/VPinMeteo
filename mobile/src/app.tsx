import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BleProvider } from "./components/ble-context";
import MigrationsLoader from "./components/migrations-loader";
import WrapperPage from "./pages/wrapper";

export default function App() {
  return (
    <View className="flex-1">
      <SafeAreaProvider>
        <MigrationsLoader>
          <BleProvider>
            <WrapperPage />
          </BleProvider>
        </MigrationsLoader>
      </SafeAreaProvider>
    </View>
  );
}
