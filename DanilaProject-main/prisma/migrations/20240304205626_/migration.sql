/*
  Warnings:

  - You are about to drop the `ActiveGame` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ArchivedGame` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ActiveGame` DROP FOREIGN KEY `ActiveGame_game_id_fkey`;

-- DropForeignKey
ALTER TABLE `ArchivedGame` DROP FOREIGN KEY `ArchivedGame_game_id_fkey`;

-- AlterTable
ALTER TABLE `Game` ADD COLUMN `channel_stream` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `ActiveGame`;

-- DropTable
DROP TABLE `ArchivedGame`;
