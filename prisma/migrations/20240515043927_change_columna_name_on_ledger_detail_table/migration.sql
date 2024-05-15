/*
  Warnings:

  - You are about to drop the column `note` on the `ledger_detail` table. All the data in the column will be lost.
  - Added the required column `title` to the `ledger_detail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ledger_detail` DROP COLUMN `note`,
    ADD COLUMN `title` VARCHAR(100) NOT NULL,
    MODIFY `detail` VARCHAR(4000) NULL;
