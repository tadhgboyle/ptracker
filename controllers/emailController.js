const User = require("../models/user");
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

async function changeEmailStatus(req, res, userId) {
    const user = await User.find(parseInt(userId))
    if (user.emailNotif) {
        await prisma.user.update({
            where: {
                id: parseInt(user.id)
            },
            data: {
                emailNotifications: false,
            }
        })
    } else {
        await prisma.user.update({
            where: {
                id: parseInt(user.id)
            },
            data: {
                emailNotifications: true,
            }
        })
    }
    res.redirect('back')
}

module.exports = {
    changeEmailStatus
}
