const {PrismaClient} = require("@prisma/client");

module.exports = class Shift {

    static prisma = new PrismaClient();

    static create = (data) => {
        return Shift.prisma.shift.create({
            data: {
                user: { connect: { id: parseInt(data.userId) } },
                site: { connect: { id: parseInt(data.siteId) } },
                date: new Date(data.date),
                type: data.type,
            }
        });
    }

    static update = (id, data) => {
        Shift.prisma.shift.update({
            where: { id },
            data: {
                user: { connect: { id: parseInt(data.userId) } },
                site: { connect: { id: parseInt(data.siteId) } },
                date: new Date(data.date),
                type: data.type,
            }
        });

        return Shift.prisma.shift.findOne({
            where: { id },
            include: {
                user: true,
                site: true
            }
        });
    }

    static all = () => {
        return Shift.prisma.shift.findMany({
            include: {
                user: true,
                site: true
            }
        });
    }

    static allForLoggedInUser = (userId) => {
        return Shift.prisma.shift.findMany({
            where: { userId },
            include: {
                user: true,
                site: true
            }
        });
    }

}
