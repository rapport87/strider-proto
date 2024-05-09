-- CreateTable
CREATE TABLE `Test` (
    `test_name` VARCHAR(10) NULL,
    `test_desc` VARCHAR(100) NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Test2` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `test_name` VARCHAR(191) NOT NULL,
    `test_desc` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
