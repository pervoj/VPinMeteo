CREATE TABLE `data_value` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`humidity` real NOT NULL,
	`temperature` real NOT NULL,
	`pressure` real NOT NULL,
	`timestamp` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `timestamp_index` ON `data_value` (`timestamp`);