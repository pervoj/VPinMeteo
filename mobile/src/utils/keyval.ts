import { eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db } from "../db";
import { keyval } from "../db/schema";

export async function setKeyValValue(name: string, value: string) {
  await db
    .insert(keyval)
    .values({ name, value })
    .onConflictDoUpdate({ target: keyval.name, set: { value } });
}

export async function removeKeyValValue(name: string) {
  await db.delete(keyval).where(eq(keyval.name, name));
}

export async function getKeyValValue(name: string) {
  return (
    await db.query.keyval.findFirst({
      where: eq(keyval.name, name),
    })
  )?.value;
}

export function useKeyValValue(name: string) {
  return useLiveQuery(
    db.query.keyval.findFirst({
      where: eq(keyval.name, name),
    }),
  ).data?.value;
}
