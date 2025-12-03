-- CreateTable
CREATE TABLE `pengambilan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_mahasiswa` INTEGER NOT NULL,
    `id_penjadwalan` INTEGER NOT NULL,
    `tahun_ajaran` VARCHAR(191) NOT NULL,
    `semester` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pengambilan` ADD CONSTRAINT `pengambilan_id_mahasiswa_fkey` FOREIGN KEY (`id_mahasiswa`) REFERENCES `mahasiswa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pengambilan` ADD CONSTRAINT `pengambilan_id_penjadwalan_fkey` FOREIGN KEY (`id_penjadwalan`) REFERENCES `penjadwalan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
