import { desc } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db } from "../db";
import { values } from "../db/schema";

export function useCurrentData() {
  const { data } = useLiveQuery(
    db.query.values.findFirst({
      orderBy: desc(values.timestamp),
    }),
  );

  return data;
}
