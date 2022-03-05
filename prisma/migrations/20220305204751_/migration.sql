/*
  Warnings:

  - The values [PENDING] on the enum `shift_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `shift` MODIFY `status` ENUM('NORMAL', 'DELETED') NOT NULL DEFAULT 'NORMAL';
