/*
  Warnings:

  - A unique constraint covering the columns `[user_id,is_default]` on the table `user_ledger` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user_ledger` ADD COLUMN `is_default` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX `user_ledger_user_id_is_default_key` ON `user_ledger`(`user_id`, `is_default`);
