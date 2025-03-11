/*
  Warnings:

  - The primary key for the `timescription` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `TimeScriptionID` to the `TimeScription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `stock` ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `imageUrl` VARCHAR(191) NULL,
    ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `minQuantity` DOUBLE NOT NULL DEFAULT 0,
    ALTER COLUMN `LastUpdated` DROP DEFAULT;

-- AlterTable
ALTER TABLE `stock_in` ADD COLUMN `cancelNote` VARCHAR(191) NULL,
    ADD COLUMN `canceledAt` DATETIME(3) NULL,
    ADD COLUMN `canceledBy` INTEGER NULL,
    ADD COLUMN `isCanceled` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `note` VARCHAR(191) NULL,
    ALTER COLUMN `stockInDateTime` DROP DEFAULT;

-- AlterTable
ALTER TABLE `timescription` DROP PRIMARY KEY,
    ADD COLUMN `TimeScriptionID` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `note` VARCHAR(191) NULL,
    ALTER COLUMN `tsCreatedAt` DROP DEFAULT,
    ADD PRIMARY KEY (`TimeScriptionID`);

-- CreateIndex
CREATE INDEX `TimeScription_Employee_empID_idx` ON `TimeScription`(`Employee_empID`);

-- AddForeignKey
ALTER TABLE `Stock_In` ADD CONSTRAINT `Stock_In_canceledBy_fkey` FOREIGN KEY (`canceledBy`) REFERENCES `Employee`(`empID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RedefineIndex
CREATE INDEX `TimeScription_Stock_stockID_idx` ON `TimeScription`(`Stock_stockID`);
DROP INDEX `TimeScription_Stock_stockID_fkey` ON `timescription`;
