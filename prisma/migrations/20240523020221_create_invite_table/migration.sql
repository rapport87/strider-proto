/*
  Warnings:

  - You are about to drop the column `invite_prg_code` on the `user_ledger` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user_ledger` DROP COLUMN `invite_prg_code`;

-- CreateTable
CREATE TABLE `user_ledger_invite` (
    `user_id` INTEGER NOT NULL,
    `ledger_id` INTEGER NOT NULL,
    `invite_prg_code` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`user_id`, `ledger_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_ledger_invite` ADD CONSTRAINT `user_ledger_invite_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_ledger_invite` ADD CONSTRAINT `user_ledger_invite_ledger_id_fkey` FOREIGN KEY (`ledger_id`) REFERENCES `ledger`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
