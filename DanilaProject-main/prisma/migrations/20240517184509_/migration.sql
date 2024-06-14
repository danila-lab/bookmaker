-- DropForeignKey
ALTER TABLE `Game` DROP FOREIGN KEY `Game_teamGame1_id_fkey`;

-- DropForeignKey
ALTER TABLE `Game` DROP FOREIGN KEY `Game_teamGame2_id_fkey`;

-- AddForeignKey
ALTER TABLE `Game` ADD CONSTRAINT `Game_teamGame1_id_fkey` FOREIGN KEY (`teamGame1_id`) REFERENCES `TeamGame`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Game` ADD CONSTRAINT `Game_teamGame2_id_fkey` FOREIGN KEY (`teamGame2_id`) REFERENCES `TeamGame`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
