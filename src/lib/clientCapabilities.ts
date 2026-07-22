type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: string;
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
};

type NavigatorWithCapabilities = Navigator & {
  connection?: NetworkInformation;
  deviceMemory?: number;
};

export function getClientCapabilities() {
  const navigatorWithCapabilities = navigator as NavigatorWithCapabilities;
  const connection = navigatorWithCapabilities.connection;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const slowConnection = connection?.effectiveType === "slow-2g" || connection?.effectiveType === "2g";
  const constrainedHardware =
    (navigatorWithCapabilities.deviceMemory ?? 8) <= 4 ||
    (navigator.hardwareConcurrency ?? 8) <= 4;

  return {
    connection,
    reducedMotion,
    coarsePointer,
    saveData: Boolean(connection?.saveData),
    slowConnection,
    constrainedHardware,
  };
}

export function prefersLiteExperience() {
  const capabilities = getClientCapabilities();
  return capabilities.reducedMotion || capabilities.saveData || capabilities.slowConnection;
}
