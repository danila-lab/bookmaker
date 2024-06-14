/*
  Warnings:

  - You are about to drop the column `type` on the `Bet` table. All the data in the column will be lost.
  - Added the required column `type` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Bet` DROP COLUMN `type`;

-- AlterTable
ALTER TABLE `Game` ADD COLUMN `type` ENUM('live', 'static') NOT NULL;
