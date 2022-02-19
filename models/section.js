const {PrismaClient} = require("@prisma/client");

module.exports = class Section {

    static prisma = new PrismaClient();

    static find = async (id) => {
        return await Section.prisma.section.findUnique({
            where: {id: parseInt(id)},
        });
    }

    static all = async () => {
        return await Section.prisma.section.findMany();
    }

}
