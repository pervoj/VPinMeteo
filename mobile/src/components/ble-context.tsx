import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { BleManager, State } from "react-native-ble-plx";

const Context = createContext<{ manager: BleManager } | undefined>(undefined);

export function BleProvider({ children }: { children?: ReactNode }) {
  const manager = useMemo(() => new BleManager(), []);

  return <Context.Provider value={{ manager }}>{children}</Context.Provider>;
}

export function useBleManager() {
  const ble = useContext(Context);

  if (!ble) {
    throw new Error("useBleManager must be used inside BleProvider");
  }

  return ble.manager;
}

export function useBleState() {
  const manager = useBleManager();
  const [state, setState] = useState<State | undefined>(undefined);

  useEffect(() => {
    const sub = manager.onStateChange((state) => setState(state), true);
    return () => sub.remove();
  }, []);

  return state;
}

export function useBle() {
  const manager = useBleManager();
  const state = useBleState();

  return { manager, state };
}
