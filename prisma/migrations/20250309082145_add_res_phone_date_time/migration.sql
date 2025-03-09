/*
  Warnings:

  - You are about to alter the column `resTime` on the `reservations` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Time(0)`.
  - Added the required column `resPhone` to the `Reservations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `reservations` ADD COLUMN `resPhone` VARCHAR(191) NOT NULL,
    MODIFY `resDate` DATE NOT NULL,
    MODIFY `resTime` TIME(0) NOT NULL;
