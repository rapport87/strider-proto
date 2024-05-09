/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CategoryLedger` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Ledger` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserLedger` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CategoryToUserCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `CategoryLedger` DROP FOREIGN KEY `CategoryLedger_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `CategoryLedger` DROP FOREIGN KEY `CategoryLedger_ledger_id_fkey`;

-- DropForeignKey
ALTER TABLE `CategoryLedger` DROP FOREIGN KEY `CategoryLedger_user_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `UserCategory` DROP FOREIGN KEY `UserCategory_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `UserLedger` DROP FOREIGN KEY `UserLedger_ledger_id_fkey`;

-- DropForeignKey
ALTER TABLE `UserLedger` DROP FOREIGN KEY `UserLedger_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `_CategoryToUserCategory` DROP FOREIGN KEY `_CategoryToUserCategory_A_fkey`;

-- DropForeignKey
ALTER TABLE `_CategoryToUserCategory` DROP FOREIGN KEY `_CategoryToUserCategory_B_fkey`;

-- DropTable
DROP TABLE `Category`;

-- DropTable
DROP TABLE `CategoryLedger`;

-- DropTable
DROP TABLE `Ledger`;

-- DropTable
DROP TABLE `User`;

-- DropTable
DROP TABLE `UserCategory`;

-- DropTable
DROP TABLE `UserLedger`;

-- DropTable
DROP TABLE `_CategoryToUserCategory`;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(100) NULL,
    `password` VARCHAR(16) NOT NULL,
    `user_name` VARCHAR(32) NOT NULL,
    `phone` VARCHAR(11) NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ledger` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ledger_name` VARCHAR(32) NOT NULL,
    `detail` VARCHAR(100) NOT NULL,
    `note` VARCHAR(4000) NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_name` VARCHAR(32) NOT NULL,
    `category_code` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `category_name` VARCHAR(32) NOT NULL,
    `category_code` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_ledger` (
    `user_id` INTEGER NOT NULL,
    `ledger_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`user_id`, `ledger_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category_ledger` (
    `ledger_id` INTEGER NOT NULL,
    `category_id` INTEGER NULL,
    `user_category_id` INTEGER NULL,
    `created_at` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`ledger_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_categoryTouser_category` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_categoryTouser_category_AB_unique`(`A`, `B`),
    INDEX `_categoryTouser_category_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_category` ADD CONSTRAINT `user_category_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_ledger` ADD CONSTRAINT `user_ledger_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_ledger` ADD CONSTRAINT `user_ledger_ledger_id_fkey` FOREIGN KEY (`ledger_id`) REFERENCES `ledger`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category_ledger` ADD CONSTRAINT `category_ledger_ledger_id_fkey` FOREIGN KEY (`ledger_id`) REFERENCES `ledger`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category_ledger` ADD CONSTRAINT `category_ledger_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category_ledger` ADD CONSTRAINT `category_ledger_user_category_id_fkey` FOREIGN KEY (`user_category_id`) REFERENCES `user_category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_categoryTouser_category` ADD CONSTRAINT `_categoryTouser_category_A_fkey` FOREIGN KEY (`A`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_categoryTouser_category` ADD CONSTRAINT `_categoryTouser_category_B_fkey` FOREIGN KEY (`B`) REFERENCES `user_category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
