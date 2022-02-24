/*
  Warnings:

  - Added the required column `status` to the `shift` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `shift` ADD COLUMN `status` ENUM('NORMAL', 'PENDING', 'DELETED') NOT NULL;
