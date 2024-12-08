import { eq } from "drizzle-orm";
import { useCallback, useEffect } from "react";
import { Device } from "react-native-ble-plx";
import { db } from "../db";
import { values } from "../db/schema";
import { listenForCommand } from "./bluetooth";

export function useDataListener(device?: Device) {
  const cb: Parameters<typeof listenForCommand>[1] = useCallback(
    async ({ command, data }) => {
      if (command != "data") return;
      const dataValues = data!.map(parseFloat);

      const valueAge = dataValues[0] - dataValues[1];
      const timestamp = Date.now() - valueAge;
      const date = new Date(timestamp);
      date.setMilliseconds(0);

      const items = await db
        .select({ id: values.id })
        .from(values)
        .where(eq(values.timestamp, date));

      if (items.length) return;

      await db.insert(values).values({
        humidity: dataValues[2],
        temperature: dataValues[3],
        pressure: dataValues[4],
        timestamp: date,
      });
    },
    [],
  );

  useEffect(() => {
    if (!device) return;
    listenForCommand(device, cb);
  }, [device]);
}
