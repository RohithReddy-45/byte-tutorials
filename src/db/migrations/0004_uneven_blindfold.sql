ALTER TABLE `youtube_details` RENAME COLUMN "author" TO "creator";--> statement-breakpoint
ALTER TABLE `youtube_details` RENAME COLUMN "author_url" TO "creator_url";--> statement-breakpoint
CREATE TABLE `playlist_videos` (
	`id` text PRIMARY KEY NOT NULL,
	`playlist_id` text NOT NULL,
	`video_id` text NOT NULL,
	`order_index` integer NOT NULL,
	FOREIGN KEY (`playlist_id`) REFERENCES `playlists`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`video_id`) REFERENCES `youtube_details`(`video_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `playlists` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`slug` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `playlists_slug_unique` ON `playlists` (`slug`);--> statement-breakpoint
CREATE TABLE `video_notes` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`video_id` text NOT NULL,
	`note_text` text NOT NULL,
	`timestamp` integer NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`video_id`) REFERENCES `youtube_details`(`video_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `video_progress` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`video_id` text NOT NULL,
	`last_position` integer DEFAULT 0 NOT NULL,
	`duration` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'not_started' NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`video_id`) REFERENCES `youtube_details`(`video_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_user_video_progress` ON `video_progress` (`user_id`,`video_id`);--> statement-breakpoint
DROP INDEX "provider_account_id_idx";--> statement-breakpoint
DROP INDEX "playlists_slug_unique";--> statement-breakpoint
DROP INDEX "users_email_unique";--> statement-breakpoint
DROP INDEX "unique_user_video_progress";--> statement-breakpoint
DROP INDEX "unique_user_video";--> statement-breakpoint
DROP INDEX "youtube_details_video_id_unique";--> statement-breakpoint
DROP INDEX "video_id_idx";--> statement-breakpoint
ALTER TABLE `youtube_details` ALTER COLUMN "tags" TO "tags" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `provider_account_id_idx` ON `auth_accounts` (`provider`,`provider_account_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `unique_user_video` ON `watch_list` (`user_id`,`video_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `youtube_details_video_id_unique` ON `youtube_details` (`video_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `video_id_idx` ON `youtube_details` (`video_id`);