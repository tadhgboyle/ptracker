const axios = require('axios');
const Shift = require("../models/shift");

async function create(req, res, {userId, siteId, date, type}) {
    await Shift.create({
        userId,
        siteId,
        date,
        type,
    });

    req.session.success_message = `Shift created successfully on ${date}!`;

    return res.redirect('/calendar');
}

async function update(req, res, shiftId, {userId, siteId, date, type}) {
    await Shift.update(
        shiftId,
        {
            userId,
            siteId,
            date,
            type,
        }
    );

    req.session.success_message = `Shift updated successfully on ${date}!`;

    res.redirect('/calendar');
}

async function del(req, res, shiftId, user) {
    const shift = await Shift.find(shiftId);

    if (shift.user.id !== user.id) {
        req.session.error_message = 'This is not your shift!';
        return res.redirect('/calendar');
    }

    if (shift.status === 'PENDING') {
        req.session.error_message = 'You have already requested deletion of this shift!';
        return res.redirect('/calendar');
    }

    await Shift.prisma.shift.update({
        where: {id: parseInt(shiftId)},
        data: {
            status: 'PENDING',
        }
    });

    let URL = process.env.APP_URL;
    if (URL.endsWith('/')) {
        URL = URL.slice(0, -1);
    }

    await axios.post(URL + '/email/shiftDeletionRequest', {
        name: shift.user.name,
        date: shift.date.toLocaleString(),
    });

    req.session.success_message = `Shift deletion requested!`;

    res.redirect('/calendar');
}

module.exports = {
    create,
    update,
    del,
}
