CREATE TABLE `users` (
	`id` text,
	`teamId` text,
	`name` text,
	`real_name` text,
	`updated_ts` integer,
	`updated` text,
	`body` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_id_unique` ON `users` (`id`);