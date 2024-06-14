-- DropForeignKey
ALTER TABLE `Game` DROP FOREIGN KEY `Game_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `TeamGame` DROP FOREIGN KEY `TeamGame_team_id_fkey`;

-- AddForeignKey
ALTER TABLE `TeamGame` ADD CONSTRAINT `TeamGame_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `Team`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Game` ADD CONSTRAINT `Game_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
