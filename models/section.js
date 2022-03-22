const {PrismaClient} = require("@prisma/client");
const User = require("../models/user");
const { update } = require("./shift");
const Role = require('./role');

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

    static whereIsInstructor = async (instructorId) => {
        return await Section.prisma.section.findUnique({
            where: {instructorId: parseInt(instructorId)},
        });
    }

    static create = async (sectionName, sectionInstructor) => {
        await Section.prisma.section.create({
            data: {
                name: sectionName,
                instructorId: parseInt(sectionInstructor),
            }
        });
    }

    static delete = async (sectionId) => {
    // Update all Students to be PENDING sectionId (1)
        await User.prisma.user.updateMany({
            where: {
                    sectionId: parseInt(sectionId),
                    role: { 
                        in: [Role.STUDENT, Role.INSTRUCTOR, Role.ADMIN],
                    },
            },
            data: {
                sectionId: 1,
            }
        })

        return await Section.prisma.section.delete({
            where: {
                id: parseInt(sectionId)
            }
        })
    }

}
