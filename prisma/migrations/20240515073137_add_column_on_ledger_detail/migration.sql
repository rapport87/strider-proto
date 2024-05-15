/*
  Warnings:

  - You are about to drop the column `category_id` on the `ledger_category` table. All the data in the column will be lost.
  - Made the column `user_category_id` on table `ledger_category` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `price` to the `ledger_detail` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ledger_category` DROP FOREIGN KEY `ledger_category_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `ledger_category` DROP FOREIGN KEY `ledger_category_user_category_id_fkey`;

-- AlterTable
ALTER TABLE `ledger_category` DROP COLUMN `category_id`,
    ADD COLUMN `categoryId` INTEGER NULL,
    MODIFY `user_category_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `ledger_detail` ADD COLUMN `evented_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `photo` VARCHAR(200) NULL,
    ADD COLUMN `price` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `ledger_category` ADD CONSTRAINT `ledger_category_user_category_id_fkey` FOREIGN KEY (`user_category_id`) REFERENCES `user_category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ledger_category` ADD CONSTRAINT `ledger_category_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
