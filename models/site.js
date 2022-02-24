const {PrismaClient} = require("@prisma/client");

module.exports = class Site {

    static prisma = new PrismaClient();

    static find = async (id) => {
        return await Site.prisma.site.findUnique({
            where: {
                id: parseInt(id),
            },
            include: {
                shift: true,
            }
        })
    }

    static all = async () => {
        return await Site.prisma.site.findMany();
    }

    static create = async (data) => {
        return await Site.prisma.site.create({
            data: {
                name: data.site.toUpperCase(),
            }
        });
    }

    static delete = async (id) => {
        const findSite = await Site.find(id)
        if (findSite.shift !== 0) {
            for (const shift of findSite.shift) {
                await Site.prisma.shift.delete({
                    where: {
                        id: parseInt(shift.id)
                    }
                })
            }
        };
        return await Site.prisma.site.delete({
            where: {
                id: parseInt(id)
            }
        });
    }

}