-- DropForeignKey
ALTER TABLE `penjadwalan` DROP FOREIGN KEY `penjadwalan_id_dosen_fkey`;

-- DropIndex
DROP INDEX `penjadwalan_id_dosen_fkey` ON `penjadwalan`;

-- AddForeignKey
ALTER TABLE `penjadwalan` ADD CONSTRAINT `penjadwalan_id_dosen_fkey` FOREIGN KEY (`id_dosen`) REFERENCES `dosen`(`nidn`) ON DELETE RESTRICT ON UPDATE CASCADE;
