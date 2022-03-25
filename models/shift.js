const {PrismaClient} = require("@prisma/client");

module.exports = class Shift {

    static prisma = new PrismaClient();

    static create = async (data) => {
        await Shift.prisma.shift.create({
            data: {
                user: {connect: {id: parseInt(data.userId)}},
                site: {connect: {id: parseInt(data.siteId)}},
                date: new Date(data.date),
                type: data.type,
                status: 'NORMAL',
                preceptor: data.preceptor
            }
        });
    }

    static update = async (id, data) => {
         await Shift.prisma.shift.update({
            where: {
                id: parseInt(id)
            },
            data: {
                userId: parseInt(data.userId),
                siteId: parseInt(data.siteId),
                date: new Date(data.date),
                type: data.type,
                preceptor: data.preceptor
            }
        })
    }

    static all = () => {
        return Shift.prisma.shift.findMany({
            include: {
                user: true,
                site: true
            }
        });
    }

    static find = async (id) => {
        return await Shift.prisma.shift.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                user: true,
                site: true
            }
        });
    }

    static allForLoggedInUser = async (userId) => {
        return await Shift.prisma.shift.findMany({
            where: {userId},
            include: {
                user: true,
                site: true
            }
        });
    }

}
