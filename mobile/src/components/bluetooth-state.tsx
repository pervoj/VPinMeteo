import { BluetoothOff, BluetoothSearching } from "lucide-react-native";
import { ReactNode } from "react";
import { Text } from "react-native";
import { State } from "react-native-ble-plx";
import { Banner, BannerContent, BannerHeader } from "./banner";
import { useBle } from "./ble-context";

export default function BluetoothState({ children }: { children?: ReactNode }) {
  const { state } = useBle();

  if (!state || state == State.Unknown || state == State.Resetting) {
    return (
      <Banner variant="info">
        <BannerHeader icon={BluetoothSearching} title="Načítání stavu" />
        <BannerContent>
          <Text className="text-neutral-950 dark:text-neutral-100">
            Aplikace se snaží zjistit stav Bluetooth a připojení k zařízení.
          </Text>
        </BannerContent>
      </Banner>
    );
  }

  if (state == State.Unauthorized || state == State.Unsupported) {
    return (
      <Banner variant="error">
        <BannerHeader icon={BluetoothOff} title="Přístup k Bluetooth" />
        <BannerContent>
          <Text className="text-neutral-950 dark:text-neutral-100">
            Aplikace nemá povolení k používání Bluetooth nebo zařízení
            nepodporuje Bluetooth.
          </Text>
        </BannerContent>
      </Banner>
    );
  }

  if (state == State.PoweredOff) {
    return (
      <Banner variant="warning">
        <BannerHeader icon={BluetoothOff} title="Vypnutý Bluetooth" />
        <BannerContent>
          <Text className="text-neutral-950 dark:text-neutral-100">
            Bluetooth je vypnutý. Pro pokračování je nutné jej zapnout.
          </Text>
        </BannerContent>
      </Banner>
    );
  }

  return children;
}
