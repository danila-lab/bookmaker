-- DropForeignKey
ALTER TABLE `Bet` DROP FOREIGN KEY `Bet_game_id_fkey`;

-- DropForeignKey
ALTER TABLE `Bet` DROP FOREIGN KEY `Bet_user_id_fkey`;

-- AddForeignKey
ALTER TABLE `Bet` ADD CONSTRAINT `Bet_game_id_fkey` FOREIGN KEY (`game_id`) REFERENCES `Game`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bet` ADD CONSTRAINT `Bet_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
