/*
  Warnings:

  - You are about to drop the column `password` on the `dosen` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `dosen` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `mahasiswa` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `mahasiswa` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `dosen_username_key` ON `dosen`;

-- DropIndex
DROP INDEX `mahasiswa_username_key` ON `mahasiswa`;

-- AlterTable
ALTER TABLE `dosen` DROP COLUMN `password`,
    DROP COLUMN `username`;

-- AlterTable
ALTER TABLE `mahasiswa` DROP COLUMN `password`,
    DROP COLUMN `username`;
