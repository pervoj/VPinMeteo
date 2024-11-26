import { useColorScheme } from "nativewind";

export function useIsLight() {
  const { colorScheme } = useColorScheme();
  return !colorScheme ? undefined : colorScheme == "light";
}
