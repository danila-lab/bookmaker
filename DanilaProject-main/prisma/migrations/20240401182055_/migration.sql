/*
  Warnings:

  - You are about to drop the column `amount` on the `Bet` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `DepositHistory` table. All the data in the column will be lost.
  - You are about to drop the column `coefficient` on the `TeamGame` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `WithdrawHistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Bet` DROP COLUMN `amount`,
    ADD COLUMN `DECIMAL(10,2)` DOUBLE NOT NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE `DepositHistory` DROP COLUMN `amount`,
    ADD COLUMN `DECIMAL(10,2)` DOUBLE NOT NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE `TeamGame` DROP COLUMN `coefficient`,
    ADD COLUMN `DECIMAL(10,2)` DOUBLE NOT NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE `WithdrawHistory` DROP COLUMN `amount`,
    ADD COLUMN `DECIMAL(10,2)` DOUBLE NOT NULL DEFAULT 0.00;
