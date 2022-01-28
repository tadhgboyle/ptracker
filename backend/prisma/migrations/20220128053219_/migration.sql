/*
  Warnings:

  - You are about to alter the column `role` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Enum("User_role")` to `Enum("User_role")`.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `role` ENUM('STUDENT', 'INSTRUCTOR', 'ADMIN') NOT NULL DEFAULT 'STUDENT';
