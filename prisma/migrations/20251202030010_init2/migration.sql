/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `dosen` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `mahasiswa` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `dosen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `mahasiswa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `dosen` ADD COLUMN `user_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `mahasiswa` ADD COLUMN `user_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'MAHASISWA', 'DOSEN') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `dosen_user_id_key` ON `dosen`(`user_id`);

-- CreateIndex
CREATE UNIQUE INDEX `mahasiswa_user_id_key` ON `mahasiswa`(`user_id`);

-- AddForeignKey
ALTER TABLE `dosen` ADD CONSTRAINT `dosen_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mahasiswa` ADD CONSTRAINT `mahasiswa_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
