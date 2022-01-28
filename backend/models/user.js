const { PrismaClient } = require('@prisma/client');

module.exports = class User {

    static prisma = new PrismaClient();

    constructor() {
    }

    static find = async (id) => {
        return await User.prisma.user.findUnique({
            where: { id }
        });
    }

    static all = async () => {
        return await User.prisma.user.findMany();
    }

    update = async (data) => {
        return await User.prisma.user.update({
            where: { id: data.id },
            data: {
                name: data.name,
                email: data.email,
                password: data.password,
                role: data.role
            }
        });
    }
}
