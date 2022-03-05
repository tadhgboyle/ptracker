const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const axios = require("axios");

const Role = require("../models/role");
const Section = require("../models/section");
const User = require("../models/user");

async function changeRole(req, res, userId, newRole) {
    if (newRole === Role.STUDENT) {
        const section = await Section.whereIsInstructor(userId);
        if (section) {
            req.session.error_message = `User is currently assigned to section ${section.name}, and cannot be demoted!`;
            return res.redirect('/admin');
        }
    }

    await User.update(userId, {
        role: newRole
    });

    req.session.success_message = `Set role of user #${userId} to ${newRole}`;

    return res.redirect('/admin');
}

async function changeSection(req, res, userId, newSection) {
    const section = await Section.find(newSection);
    if (!section) {
        req.session.error_message = `Section #${newSection} does not exist`;
        return res.redirect('/admin');
    }

    await User.prisma.user.update({
        where: {id: parseInt(userId)},
        data: {
            section: {connect: {id: section.id}}
        }
    });

    let URL = process.env.APP_URL;
    if (URL.endsWith('/')) {
        URL = URL.slice(0, -1);
    }

    const user = await User.find(parseInt(userId));

    await axios.post(URL + '/email/userAssignedSection', {
        sendTo: user.email,
        sectionName: section.name,
    });

    req.session.success_message = `Set section of user #${userId} to ${section.name}`;

    return res.redirect('/admin');
}

async function changeSectionInstructor(req, res, sectionId, newInstructor) {
    const section = await Section.find(sectionId);

    if (!section) {
        req.session.error_message = `Section #${sectionId} does not exist`;
        return res.redirect('/admin');
    }

    try {
        await Section.prisma.section.update({
            where: {id: parseInt(sectionId)},
            data: {
                instructorId: parseInt(newInstructor)
            }
        });
    } catch (e) {
        req.session.error_message = `Instructor #${newInstructor} is already assigned another section`;
        return res.redirect('/admin');
    }

    await User.prisma.user.update({
        where: {id: parseInt(newInstructor)},
        data: {
            section: {connect: {id: section.id}}
        }
    });

    req.session.success_message = `Set instructor of section ${section.name} to #${newInstructor}`;

    return res.redirect('/admin');
}

async function instructorDelete(req, res, userId) {
    const user = await User.find(userId);
    if (!user) {
        req.session.error_message = `Instructor #${userId} does not exist`;
        return res.redirect('/admin');
    }
    if (user.shifts.length >= 1) {
        for (const shift of user.shifts) {
            await prisma.shift.delete({
                where: {
                    id: parseInt(shift.id)
                }
            })
        }
    }

    await prisma.user.delete({
        where: {
            id: parseInt(userId)
        }
    });

    let URL = process.env.APP_URL;
    if (URL.endsWith('/')) {
        URL = URL.slice(0, -1);
    }

    await axios.post(URL + '/email/instructorDeclined', {
        name: user.name,
    });

    req.session.success_message = `Successfully deleted ${user.name}.`;

    return res.redirect('/admin');
}

module.exports = {
    instructorDelete,
    changeSectionInstructor,
    changeSection,
    changeRole,
}
