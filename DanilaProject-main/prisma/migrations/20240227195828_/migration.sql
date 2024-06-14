/*
  Warnings:

  - Added the required column `finish_date` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Game` DROP FOREIGN KEY `Game_teamGame1_id_fkey`;

-- DropForeignKey
ALTER TABLE `Game` DROP FOREIGN KEY `Game_teamGame2_id_fkey`;

-- AlterTable
ALTER TABLE `Game` ADD COLUMN `finish_date` DATETIME(3) NOT NULL,
    ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT true;

-- AddForeignKey
ALTER TABLE `Game` ADD CONSTRAINT `Game_teamGame1_id_fkey` FOREIGN KEY (`teamGame1_id`) REFERENCES `TeamGame`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Game` ADD CONSTRAINT `Game_teamGame2_id_fkey` FOREIGN KEY (`teamGame2_id`) REFERENCES `TeamGame`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
