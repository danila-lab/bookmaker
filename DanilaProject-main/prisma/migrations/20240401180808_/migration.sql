/*
  Warnings:

  - You are about to drop the column `balance` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `balance`,
    ADD COLUMN `DECIMAL(10,2)` DOUBLE NOT NULL DEFAULT 0.00;