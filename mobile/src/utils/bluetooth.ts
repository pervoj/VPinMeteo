import { BleManager, Device, DeviceId, Service } from "react-native-ble-plx";

export async function connectToDevice(manager: BleManager, device: DeviceId) {
  const connected = await manager.devices([device]);
  if (connected.length) return connected[0];
  return await manager.connectToDevice(device);
}

export async function getCharacteristics(service: Service) {
  return (await service.characteristics())
    .filter((c) => {
      return c.isNotifiable && c.isReadable && c.isWritableWithResponse;
    })
    .map((c) => c.uuid);
}

export async function getServices(device: Device) {
  await device.discoverAllServicesAndCharacteristics();

  const services = (await device.services()).filter((s) => s.isPrimary);
  return await Promise.all(
    services.map(async (s) => {
      return {
        uuid: s.uuid,
        characteristics: await getCharacteristics(s),
      };
    }),
  );
}

export async function getServiceAndCharacteristic(device: Device) {
  if (!(await device.isConnected())) return;

  const service = (await getServices(device)).find((s) => {
    return s.characteristics.length > 0;
  });

  if (!service) return;
  return {
    service: service.uuid,
    characteristic: service.characteristics[0],
  };
}

export function listenForMessage(
  device: Device,
  ids: NonNullable<Awaited<ReturnType<typeof getServiceAndCharacteristic>>>,
  cb: (message: string) => void,
) {
  let currentMessage = "";
  return device.monitorCharacteristicForService(
    ids.service,
    ids.characteristic,
    (_, res) => {
      if (!res?.value) return;
      for (const char of atob(res.value)) {
        if (char == "$") {
          currentMessage = "";
        } else if (char == ";") {
          cb(currentMessage);
        } else {
          currentMessage += char;
        }
      }
    },
  );
}

export async function listenForMessageFromDevice(
  device: Device,
  cb: Parameters<typeof listenForMessage>[2],
) {
  const ids = await getServiceAndCharacteristic(device);
  if (!ids) return;
  return listenForMessage(device, ids, cb);
}

export async function listenForCommand(
  device: Device,
  cb: (params: { command: string; data?: string[] }) => void,
) {
  return await listenForMessageFromDevice(device, (msg) => {
    const parts = msg.split(":");
    if (!parts.length) return;

    if (parts.length == 1) {
      cb({ command: parts[0] });
      return;
    }

    const command = parts.shift()!;
    const ending = parts.pop()!;
    if (command != ending) return;

    cb({ command, data: parts.length ? parts : undefined });
  });
}
