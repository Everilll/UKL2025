/*
  Warnings:

  - Added the required column `semester` to the `penjadwalan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tahun_ajaran` to the `penjadwalan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `penjadwalan` ADD COLUMN `semester` VARCHAR(191) NOT NULL,
    ADD COLUMN `tahun_ajaran` VARCHAR(191) NOT NULL;
