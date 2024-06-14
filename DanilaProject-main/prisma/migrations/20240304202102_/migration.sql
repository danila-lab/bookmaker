/*
  Warnings:

  - You are about to drop the column `channel_stream` on the `Game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Game` DROP COLUMN `channel_stream`;

-- CreateTable
CREATE TABLE `ActiveGame` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `game_id` INTEGER NOT NULL,
    `channel_stream` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ArchivedGame` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `game_id` INTEGER NOT NULL,
    `team_won` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ActiveGame` ADD CONSTRAINT `ActiveGame_game_id_fkey` FOREIGN KEY (`game_id`) REFERENCES `Game`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ArchivedGame` ADD CONSTRAINT `ArchivedGame_game_id_fkey` FOREIGN KEY (`game_id`) REFERENCES `Game`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
