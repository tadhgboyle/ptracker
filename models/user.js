const { PrismaClient } = require('@prisma/client');
const Role = require('./role');

module.exports = class User {

    static prisma = new PrismaClient();

    constructor(data) {
        this.name = data.name;
        this.email = data.email;
        this.picture = data.picture;
        this.googleId = data.googleId;
        this.section = data.section;
        this.shifts = data.shift;
        this.role = data.role;
        this.notifications = [];
    }

    notificationsColour() {
        const count = this.notifications.length;
        if (count === 0) {
            return 'gray';
        } else if (count <= 3) {
            return 'amber';
        } else if (count <= 5) {
            return 'orange';
        } else {
            return 'red';
        }
    }

    isInstructor() {
        return this.role === Role.INSTRUCTOR || this.role === Role.ADMIN;
    }

    isAdmin() {
        return this.role === Role.ADMIN;
    }

    static find = async (id) => {
        return new User(await User.prisma.user.findUnique({
            where: { id: parseInt(id) },
            include: {
                section: true,
                shift: true,
            },
        }));
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
