/*
  Warnings:

  - The values [live,static] on the enum `Game_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Game` MODIFY `type` ENUM('manual', 'auto') NOT NULL;

-- AlterTable
ALTER TABLE `TeamGame` ADD COLUMN `totalBid` DOUBLE NOT NULL DEFAULT 0.00;
