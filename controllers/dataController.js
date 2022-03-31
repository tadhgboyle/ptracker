const Role = require("../models/role");
const User = require("../models/user");
const Shift = require("../models/shift");
const Holidays = require("date-holidays");

const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

async function dashboardStudentSites(req, res, user, start) {
    const allUsersInSection = [];
    const userCalendarDate = start.split('T')[0].split('-')
    if (user.role === Role.STUDENT) {
        const mainSite = await findMainSite(user.shifts)
        allUsersInSection.push({
            id: user.id,
            name: user.name,
            site: mainSite,
            dayshifts: countShifts(user.shifts, 'DAY', userCalendarDate),
            nightshifts: countShifts(user.shifts, 'NIGHT', userCalendarDate),
            eveningshifts: countShifts(user.shifts, 'EVENING', userCalendarDate),
            totalshifts: countShifts(user.shifts, 'ALL', userCalendarDate)
        });
    } else if (user.role === Role.INSTRUCTOR || user.role === Role.ADMIN) {
        const allStudents = await User.all();
        for (let student of allStudents) {
            const mainSite = await findMainSite(student.shift)
            if (student.sectionId === user.section.id && student.id !== user.id && student.role === Role.STUDENT) {
                allUsersInSection.push({
                    id: student.id,
                    name: student.name,
                    site: mainSite,
                    dayshifts: countShifts(student.shift, 'DAY', userCalendarDate),
                    nightshifts: countShifts(student.shift, 'NIGHT', userCalendarDate),
                    eveningshifts: countShifts(student.shift, 'EVENING', userCalendarDate),
                    totalshifts: countShifts(student.shift, 'ALL', userCalendarDate),
                });
            }
        }
    }

    return res.json(allUsersInSection);
}

async function dashboardShifts(req, res, user) {
    const shiftDays = [];
    if (user.role === Role.STUDENT) {
        for (const shift of user.shifts.filter(s => s.status !== 'DELETED')) {
            shiftDays.push({
                title: (shift.type === 'SICK' ? 'SICK' : `${shift.type[0]}x`),
                start: shift.date.toISOString().split("T")[0],
                resourceId: user.id,
                color: shiftColor(shift.type),
            });
        }

        return res.json(shiftDays);
    }

    // Users who are instructors or admins
    const allStudents = await User.all();
    for (const student of allStudents) {
        for (const shift of student.shift.filter(s => s.status !== 'DELETED')) {
            if (student.sectionId === user.section.id) {
                shiftDays.push({
                    title: (shift.type === 'SICK' ? 'SICK' : `${shift.type[0]}x`),
                    start: shift.date.toISOString().split("T")[0],
                    resourceId: student.id,
                    color: shiftColor(shift.type),
                });
            }
        }
    }

    return res.json(shiftDays);
}

async function allShifts(req, res, user) {
    const allShifts = [];
    const hd = new Holidays('CA', 'BC');
    const allHolidays = hd.getHolidays(new Date().getFullYear())
    for (const shift of await Shift.allForLoggedInUser(user.id)) {
        if (shift.status === 'DELETED') {
            continue;
        }
        let preceptor = shift.preceptor ? ` - ${shift.preceptor}` : ""
        allShifts.push({
            id: shift.id,
            title: (shift.type === 'SICK' ? 'SICK' : `${shift.type[0]}x`)+ preceptor ,
            start: shift.date.toISOString().split('T')[0],
            color: shiftColor(shift.type),
            userId: shift.userId,
            site: shift.site,
            preceptor: shift.preceptor
        })
    }
    for (const holiday of allHolidays) {
        allShifts.push({
            title: holiday.name,
            start: holiday.date.split(" ")[0],
            color: '#577590',
            userId: 'holiday'
        })
    }

    return res.json(allShifts);
}

module.exports = {
    dashboardStudentSites,
    dashboardShifts,
    allShifts,
}

const countShifts = (shifts, shiftType, calendarDate) => {
    let shiftCounter = 0;

    // This gets the date from the calendar
    const userDate = new Date(calendarDate[0],calendarDate[1] - 1,calendarDate[2]);
    const currentUserDate = `${convertMonth(userDate.getMonth())} ${userDate.getFullYear()}`;

    if (shifts.length === 0) {
        return 0;
    }

    for (const shift of shifts) {
        const splitDate = shift.date.toISOString().split('T')[0].split('-')
        const shiftMonth = new Date(splitDate[0],splitDate[1] - 1,splitDate[2])
        const monthYear = `${convertMonth(shiftMonth.getMonth())} ${shiftMonth.getFullYear()}`
        if (shiftType === 'ALL' && shift.status !== 'DELETED') {
            if (monthYear === currentUserDate) {
                shiftCounter += 1;
            }
        } else if (monthYear === currentUserDate && shift.type === shiftType && shift.status !== 'DELETED') {
            shiftCounter += 1;
        }
    }

    return shiftCounter;
}

const findNameOfSite = async (siteId) => {
    const findSite = await prisma.site.findUnique({
        where: {
            id: parseInt(siteId)
        }
    })

    return findSite.name;
}

const findMainSite = async (shifts) => {
    // Checks to see which site they are work at the most (basically checking what their main site is)
    const numOfShifts = {};
    let siteNum = [];
    for (const shift of shifts) {
        // console.log(Object.keys(numOfShifts).length)
        if (numOfShifts[shift.siteId] === undefined && shift.status !== 'DELETED') {
            numOfShifts[shift.siteId] = 1;
        } else {
            if (shift.status !== 'DELETED') {
                numOfShifts[shift.siteId] += 1;
            }
        }
    }
    for (const [key, value] of Object.entries(numOfShifts)) {
        if (siteNum.length === 0) {
            siteNum.push(key);
            siteNum.push(value);
        } else {
            if (value > siteNum[1]) {
                siteNum[0] = key;
                siteNum[1] = value;
            }
        }
    }
    if (siteNum.length !== 0) {
        return await findNameOfSite(parseInt(siteNum[0]));
    } else {
        return 'No Shift';
    }
}

const shiftColor = (shift) => {
    if (shift === 'NIGHT') {
        return '#744468'
    } else if (shift === 'EVENING') {
        return '#016BB7'
    } else if (shift === 'DAY') {
        return '#ECA446'
    } else if (shift === 'SICK') {
        return '#D05353'
    }
}

const convertMonth = (monthNum) => {
    return [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ][monthNum];
}
