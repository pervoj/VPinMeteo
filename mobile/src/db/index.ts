import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync, type SQLiteDatabase } from "expo-sqlite";
import * as schema from "./schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: SQLiteDatabase | undefined;
};

const conn =
  globalForDb.conn ?? openDatabaseSync("db.db", { enableChangeListener: true });
globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
