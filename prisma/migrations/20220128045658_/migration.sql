-- CreateTable
CREATE TABLE `User`
(
    `id`                 INTEGER                              NOT NULL AUTO_INCREMENT,
    `name`               VARCHAR(191)                         NOT NULL,
    `email`              VARCHAR(191)                         NOT NULL,
    `picture`            VARCHAR(191)                         NOT NULL,
    `googleId`           VARCHAR(191)                         NOT NULL,
    `role`               ENUM ('USER', 'INSTRUCTOR', 'ADMIN') NOT NULL DEFAULT 'USER',
    `sectionId`          INTEGER                              NOT NULL,
    `emailNotifications` BOOLEAN                              NOT NULL DEFAULT true,

    UNIQUE INDEX `User_email_key` (`email`),
    UNIQUE INDEX `User_googleId_key` (`googleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Section`
(
    `id`           INTEGER      NOT NULL AUTO_INCREMENT,
    `name`         VARCHAR(191) NOT NULL,
    `instructorId` INTEGER      NOT NULL,

    UNIQUE INDEX `Section_name_key` (`name`),
    UNIQUE INDEX `Section_instructorId_key` (`instructorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Site`
(
    `id`   INTEGER      NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Shift`
(
    `id`     INTEGER                                  NOT NULL AUTO_INCREMENT,
    `userId` INTEGER                                  NOT NULL,
    `siteId` INTEGER                                  NOT NULL,
    `date`   DATETIME(3)                              NOT NULL,
    `type`   ENUM ('DAY', 'NIGHT', 'EVENING', 'SICK') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User`
    ADD CONSTRAINT `User_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Section`
    ADD CONSTRAINT `Section_instructorId_fkey` FOREIGN KEY (`instructorId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shift`
    ADD CONSTRAINT `Shift_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shift`
    ADD CONSTRAINT `Shift_siteId_fkey` FOREIGN KEY (`siteId`) REFERENCES `Site` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
