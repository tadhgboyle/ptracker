const {PrismaClient} = require("@prisma/client");

module.exports = class Shift {

    static prisma = new PrismaClient();

    static create = data => {
        return Shift.prisma.shift.create(data);
    }

    static update = (id, data) => {
        Shift.prisma.shift.update({
            where: { id },
            data
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

}
