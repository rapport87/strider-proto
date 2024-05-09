/*
  Warnings:

  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Users`;

-- CreateTable
CREATE TABLE `USERS` (
    `USER_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `EMAIL` VARCHAR(191) NOT NULL,
    `PASSWORD` VARCHAR(191) NOT NULL,
    `USER_NAME` VARCHAR(191) NOT NULL,
    `PHONE` VARCHAR(191) NOT NULL,
    `CREATED_AT` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `UPDATED_AT` DATETIME(3) NOT NULL,

    UNIQUE INDEX `USERS_EMAIL_key`(`EMAIL`),
    UNIQUE INDEX `USERS_PHONE_key`(`PHONE`),
    PRIMARY KEY (`USER_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
