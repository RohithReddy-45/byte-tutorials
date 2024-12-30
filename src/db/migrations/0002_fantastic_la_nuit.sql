PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_auth_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`provider` text NOT NULL,
	`provider_account_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_auth_accounts`("id", "user_id", "provider", "provider_account_id") SELECT "id", "user_id", "provider", "provider_account_id" FROM `auth_accounts`;--> statement-breakpoint
DROP TABLE `auth_accounts`;--> statement-breakpoint
ALTER TABLE `__new_auth_accounts` RENAME TO `auth_accounts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `provider_account_id_idx` ON `auth_accounts` (`provider`,`provider_account_id`);--> statement-breakpoint
CREATE TABLE `__new_watch_list` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`video_id` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`video_id`) REFERENCES `youtube_details`(`video_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_watch_list`("id", "user_id", "video_id", "created_at") SELECT "id", "user_id", "video_id", "created_at" FROM `watch_list`;--> statement-breakpoint
DROP TABLE `watch_list`;--> statement-breakpoint
ALTER TABLE `__new_watch_list` RENAME TO `watch_list`;--> statement-breakpoint
CREATE UNIQUE INDEX `unique_user_video` ON `watch_list` (`user_id`,`video_id`);