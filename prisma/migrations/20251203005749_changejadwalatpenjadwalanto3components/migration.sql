/*
  Warnings:

  - You are about to drop the column `jadwal` on the `penjadwalan` table. All the data in the column will be lost.
  - Added the required column `end_time` to the `penjadwalan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hari` to the `penjadwalan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `penjadwalan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `penjadwalan` DROP COLUMN `jadwal`,
    ADD COLUMN `end_time` VARCHAR(191) NOT NULL,
    ADD COLUMN `hari` ENUM('SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU', 'MINGGU') NOT NULL,
    ADD COLUMN `start_time` VARCHAR(191) NOT NULL;
