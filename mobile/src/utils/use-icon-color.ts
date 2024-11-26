import { useIsLight } from "./use-is-light";

export function useIconColor() {
  const isLight = useIsLight();
  return isLight == undefined || isLight ? "#0a0a0a" : "#f5f5f5";
}
