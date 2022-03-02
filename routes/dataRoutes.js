// This route page is mainly used to fetch data to the calendar in the dashboard page using JSON
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

// Express and Rounter
const express = require('express');
const router = express.Router();

// Date
const date = new Date()

// User and Role Classes
const User = require('../models/user');
const Role = require('../models/role');
const Shift = require("../models/shift");
const Holidays = require("date-holidays");

// All the functions created to be used for the "Resources" and "Events" columns for fullcalendar.io
const countShifts = (shifts, shiftType, calendarDate) => {
    let shiftCounter = 0;

    // This gets the date from the calendar
    const userDate = new Date(calendarDate[0],calendarDate[1] - 1,calendarDate[2])
    const currentUserDate = `${convertMonth(userDate.getMonth())} ${userDate.getFullYear()}`

    if (shifts.length === 0) {
        return 0;
    }

    for (const shift of shifts) {
        const splitDate = shift.date.toISOString().split('T')[0].split('-')
        const shiftMonth = new Date(splitDate[0],splitDate[1] - 1,splitDate[2])
        const monthYear = `${convertMonth(shiftMonth.getMonth())} ${shiftMonth.getFullYear()}`
        if (shiftType === 'ALL' && shift.status !== 'DELETED') {
            if (monthYear === currentUserDate) {
                shiftCounter += 1
            }
        } else if (monthYear === currentUserDate && shift.type === shiftType && shift.status !== 'DELETED') {
            shiftCounter += 1
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
    return findSite.name
}

const findMainSite = async (shifts) => {
    // Checks to see which site they are work at the most (basically checking what their main site is)
    const numOfShifts = {};
    let siteNum = [];
    for (const shift of shifts) {
        // console.log(Object.keys(numOfShifts).length)
        if (numOfShifts[shift.siteId] === undefined && shift.status !== 'DELETED') {
            numOfShifts[shift.siteId] = 1
        } else {
            if (shift.status !== 'DELETED') {
                numOfShifts[shift.siteId] += 1
            }
        }
    }
    for (const [key, value] of Object.entries(numOfShifts)) {
        if (siteNum.length === 0) {
            siteNum.push(key)
            siteNum.push(value)
        } else {
            if (value > siteNum[1]) {
                siteNum[0] = key
                siteNum[1] = value
            }
        }
    }
    if (siteNum.length !== 0) {
        const site = await findNameOfSite(parseInt(siteNum[0]))
        return site
    } else {
        return 'Unassigned'
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

router.get("/dashboardStudentSites", async (req, res) => {
    const allUsersInSection = [];
    const userCalendarDate = req.query.start.split('T')[0].split('-')
    if (req.user.role === Role.STUDENT && req.user.shifts.length > 0) {
        const mainSite = await findMainSite(req.user.shifts)
        allUsersInSection.push({
            id: req.user.id,
            name: req.user.name,
            site: mainSite,
            dayshifts: countShifts(req.user.shifts, 'DAY', userCalendarDate),
            nightshifts: countShifts(req.user.shifts, 'NIGHT', userCalendarDate),
            eveningshifts: countShifts(req.user.shifts, 'EVENING', userCalendarDate),
            totalshifts: countShifts(req.user.shifts, 'ALL', userCalendarDate)
        });
    } else if (req.user.role === Role.INSTRUCTOR || req.user.role === Role.ADMIN) {
        const allStudents = await User.all();
        for (let student of allStudents) {
            const mainSite = await findMainSite(student.shift)
            if (student.sectionId === req.user.section.id && student.shift.length > 0 && student.id !== req.user.id && student.role === Role.STUDENT) {
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
    res.json(allUsersInSection);
})

router.get("/dashboardShifts", async (req, res) => {
    const shiftDays = [];

    if (req.user.role === Role.STUDENT && req.user.shifts.length > 0) {
        for (const shift of req.user.shifts.filter(s => s.status !== 'DELETED')) {
            shiftDays.push({
                title: shift.type.toLowerCase(),
                start: shift.date.toISOString().split("T")[0],
                resourceId: req.user.id,
                color: shiftColor(shift.type)
            });
        }
        return res.json(shiftDays);
    }

    // Users who are instructors or admins
    const allStudents = await User.all();
    for (const student of allStudents) {
        for (const shift of student.shift.filter(s => s.status !== 'DELETED')) {
            if (student.sectionId === req.user.section.id && student.shift.length > 0) {
                shiftDays.push({
                    title: shift.type.toLowerCase(),
                    start: shift.date.toISOString().split("T")[0],
                    resourceId: student.id,
                    color: shiftColor(shift.type)
                });
            }
        }
    }
    return res.json(shiftDays);
});

router.get('/allShifts', async (req, res) => {
    const allShifts = [];
    const hd = new Holidays('CA', 'BC');
    const allHolidays = hd.getHolidays(date.getFullYear())
    for (const shift of await Shift.allForLoggedInUser(req.user.id)) {
        if (shift.status === 'DELETED') {
            continue;
        }
        allShifts.push({
            id: shift.id,
            title: shift.type.toLowerCase(),
            start: shift.date.toISOString().split('T')[0],
            color: shiftColor(shift.type)
        })
    }
    for (const holiday of allHolidays) {
        allShifts.push({
            title: holiday.name,
            start: holiday.date.split(" ")[0],
            color: '#577590'
        })
    }
    res.json(allShifts);
});

module.exports = router;
