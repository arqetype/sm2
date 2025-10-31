CREATE TABLE `cards` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`deck_id` integer NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`created_at` integer NOT NULL,
	`interval` integer DEFAULT 0 NOT NULL,
	`repetitions` integer DEFAULT 0 NOT NULL,
	`ease_factor` real DEFAULT 2.5 NOT NULL,
	`next_review` integer,
	`last_reviewed` integer,
	FOREIGN KEY (`deck_id`) REFERENCES `decks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `cards_next_review_idx` ON `cards` (`next_review`);--> statement-breakpoint
CREATE INDEX `cards_deck_id_idx` ON `cards` (`deck_id`);--> statement-breakpoint
CREATE TABLE `decks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`card_id` integer NOT NULL,
	`quality` integer NOT NULL,
	`reviewed_at` integer NOT NULL,
	`interval_before` integer NOT NULL,
	`interval_after` integer NOT NULL,
	`ease_factor_before` real NOT NULL,
	`ease_factor_after` real NOT NULL,
	FOREIGN KEY (`card_id`) REFERENCES `cards`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_ui-state` (
	`id` integer PRIMARY KEY NOT NULL,
	`width` integer DEFAULT 1024 NOT NULL,
	`height` integer DEFAULT 768 NOT NULL,
	`x` integer,
	`y` integer,
	`is_maximised` integer DEFAULT 0 NOT NULL,
	`opened_folder` text
);
--> statement-breakpoint
DROP TABLE `ui-state`;--> statement-breakpoint
ALTER TABLE `__new_ui-state` RENAME TO `ui-state`;--> statement-breakpoint
PRAGMA foreign_keys=ON;
