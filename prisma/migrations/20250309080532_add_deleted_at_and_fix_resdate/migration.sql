/*
  Warnings:

  - You are about to alter the column `resDate` on the `reservations` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `reservations` ADD COLUMN `deletedAt` DATETIME(3) NULL,
    MODIFY `resDate` DATETIME(3) NOT NULL,
    MODIFY `resStatus` VARCHAR(191) NULL DEFAULT 'pending';
