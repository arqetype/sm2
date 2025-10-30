CREATE TABLE `ui-state` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`state` blob
);
--> statement-breakpoint
CREATE UNIQUE INDEX `name_idx` ON `ui-state` (`name`);