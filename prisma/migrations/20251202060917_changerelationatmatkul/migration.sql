-- DropForeignKey
ALTER TABLE `matakuliah` DROP FOREIGN KEY `matakuliah_id_dosen_fkey`;

-- DropIndex
DROP INDEX `matakuliah_id_dosen_fkey` ON `matakuliah`;

-- AddForeignKey
ALTER TABLE `matakuliah` ADD CONSTRAINT `matakuliah_id_dosen_fkey` FOREIGN KEY (`id_dosen`) REFERENCES `dosen`(`nidn`) ON DELETE RESTRICT ON UPDATE CASCADE;
