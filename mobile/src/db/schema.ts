import {
  index,
  integer,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const keyval = sqliteTable("keyval", {
  name: text().primaryKey(),
  value: text().notNull(),
});

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
