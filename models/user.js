const { PrismaClient } = require('@prisma/client');

module.exports = class User {

    static prisma = new PrismaClient();

    constructor() {
    }

    static find = async (id) => {
        return await User.prisma.user.findUnique({
            where: { id: parseInt(id) },
            include: {
                section: true,
                shift: true,
            },
        });
    }

    static all = async () => {
        return await User.prisma.user.findMany({
            include: {
                section: true,
                shift: true,
            },
        });
    }

    static update = async (id, data) => {
        return await User.prisma.user.update({
            where: { id: parseInt(id) },
            data: {
                name: data.name,
                email: data.email,
                password: data.password,
                role: data.role
            }
        });
    }
}
