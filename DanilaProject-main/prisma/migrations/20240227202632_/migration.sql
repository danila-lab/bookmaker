/*
  Warnings:

  - You are about to drop the column `finish_date` on the `Game` table. All the data in the column will be lost.
  - Added the required column `game_finish_date` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `game_start_date` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Game` DROP COLUMN `finish_date`,
    ADD COLUMN `game_finish_date` DATETIME(3) NOT NULL,
    ADD COLUMN `game_start_date` DATETIME(3) NOT NULL;
