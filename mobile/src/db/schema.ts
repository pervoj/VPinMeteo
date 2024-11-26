import { index, integer, real, sqliteTable } from "drizzle-orm/sqlite-core";

export const values = sqliteTable(
  "data_value",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    humidity: real().notNull(),
    temperature: real().notNull(),
    pressure: real().notNull(),
    timestamp: integer({ mode: "timestamp" }).notNull().unique(),
  },
  (table) => ({
    timeIndex: index("timestamp_index").on(table.timestamp),
  }),
);
