-- CreateTable
CREATE TABLE `dosen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nidn` INTEGER NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `nama_dosen` VARCHAR(191) NOT NULL,
    `jenis_kelamin` ENUM('L', 'P') NOT NULL,
    `alamat` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'MAHASISWA', 'DOSEN') NOT NULL DEFAULT 'DOSEN',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `dosen_nidn_key`(`nidn`),
    UNIQUE INDEX `dosen_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `matakuliah` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_matakuliah` VARCHAR(191) NOT NULL,
    `nama_matakuliah` VARCHAR(191) NOT NULL,
    `id_dosen` INTEGER NOT NULL,
    `sks` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `matakuliah_id_matakuliah_key`(`id_matakuliah`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mahasiswa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nim` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `nama_mahasiswa` VARCHAR(191) NOT NULL,
    `jenis_kelamin` ENUM('L', 'P') NOT NULL,
    `jurusan` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'MAHASISWA', 'DOSEN') NOT NULL DEFAULT 'MAHASISWA',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `mahasiswa_nim_key`(`nim`),
    UNIQUE INDEX `mahasiswa_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `penjadwalan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_dosen` INTEGER NOT NULL,
    `id_matakuliah` INTEGER NOT NULL,
    `jadwal` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_admin` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'MAHASISWA', 'DOSEN') NOT NULL DEFAULT 'ADMIN',

    UNIQUE INDEX `admin_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `matakuliah` ADD CONSTRAINT `matakuliah_id_dosen_fkey` FOREIGN KEY (`id_dosen`) REFERENCES `dosen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `penjadwalan` ADD CONSTRAINT `penjadwalan_id_dosen_fkey` FOREIGN KEY (`id_dosen`) REFERENCES `dosen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `penjadwalan` ADD CONSTRAINT `penjadwalan_id_matakuliah_fkey` FOREIGN KEY (`id_matakuliah`) REFERENCES `matakuliah`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
