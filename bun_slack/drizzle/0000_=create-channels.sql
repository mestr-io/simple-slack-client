CREATE TABLE `channels` (
	`id` text NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`created_ts` integer NOT NULL,
	`updated_ts` integer,
	`created` text NOT NULL,
	`updated` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `channels_id_unique` ON `channels` (`id`);