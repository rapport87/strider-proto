/*
  Warnings:

  - You are about to drop the `Test` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Test2` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Test`;

-- DropTable
DROP TABLE `Test2`;

-- CreateTable
CREATE TABLE `Users` (
    `USER_ID` VARCHAR(191) NOT NULL,
    `USER_NAME` VARCHAR(191) NOT NULL,
    `PASSWORD` VARCHAR(191) NOT NULL,
    `EMAIL` VARCHAR(191) NOT NULL,
    `PHONE` VARCHAR(191) NOT NULL,
    `CREATED_AT` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `UPDATED_AT` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Users_USER_ID_key`(`USER_ID`),
    UNIQUE INDEX `Users_PHONE_key`(`PHONE`),
    PRIMARY KEY (`USER_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
