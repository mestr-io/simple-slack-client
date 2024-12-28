PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_channels` (
	`id` text,
	`name` text,
	`type` text,
	`created_ts` integer,
	`updated_ts` integer,
	`created` text NOT NULL,
	`updated` text,
	`body` text
);
--> statement-breakpoint
INSERT INTO `__new_channels`("id", "name", "type", "created_ts", "updated_ts", "created", "updated", "body") SELECT "id", "name", "type", "created_ts", "updated_ts", "created", "updated", "body" FROM `channels`;--> statement-breakpoint
DROP TABLE `channels`;--> statement-breakpoint
ALTER TABLE `__new_channels` RENAME TO `channels`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `channels_id_unique` ON `channels` (`id`);