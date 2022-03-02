const {PrismaClient} = require('@prisma/client');
const Role = require('./role');

module.exports = class User {

    static prisma = new PrismaClient();

    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.picture = data.picture;
        this.googleId = data.googleId;
        this.section = data.section;
        this.shifts = data.shift;
        this.role = data.role;
        this.acceptedNda = data.acceptedNda;
        this.emailNotif = data.emailNotifications;
    }

    isStudent() {
        return this.role === Role.STUDENT;
    }

    isInstructor() {
        return this.role === Role.INSTRUCTOR || this.isAdmin();
    }

    isAdmin() {
        return this.role === Role.ADMIN;
    }

    static find = async (id) => {
        return new User(await User.prisma.user.findUnique({
            where: {id: parseInt(id)},
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

    static allInSection = async (sectionId) => {
        return await User.prisma.user.findMany({
            where: {
                sectionId: parseInt(sectionId),
                role: Role.STUDENT,
            },
            include: {
                section: true,
                shift: true,
            },
        });
    }

    static update = async (id, data) => {
        return await User.prisma.user.update({
            where: {id: parseInt(id)},
            data: data,
        });
    }
}
