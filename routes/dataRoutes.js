// This route page is mainly used to fetch data to the calendar in the dashboard page using JSON

// Express and Rounter
const express = require('express');
const router = express.Router();

// Date
const date = new Date()

// User and Role Classes
const User = require('../models/user');
const Role = require('../models/role');

// All the functions created to be used for the "Resources" and "Events" columns for fullcalendar.io
const countShifts = (shifts, shiftType) => {
    let shiftCounter = 0;
    const currentMonthYear = `${convertMonth(date.getMonth())} ${date.getFullYear()}`
    if (shifts.length === 0) {
        return 0;
    }

    for (const shift of shifts) {
        const splitDate = shift.date.toISOString().split('T')[0].split('-')
        const shiftMonth = new Date(splitDate[0],splitDate[1] - 1,splitDate[2])
        const monthYear = `${convertMonth(shiftMonth.getMonth())} ${shiftMonth.getFullYear()}`
        if (shiftType === 'ALL' && shift.status !== 'NORMAL') {
            if (monthYear === currentMonthYear) {
                shiftCounter += 1
            }
        } else if (monthYear === currentMonthYear && shift.type === shiftType && shift.status === 'NORMAL') {
            shiftCounter += 1
        }
    }
    return shiftCounter;
}

const findMainSite = (shifts) => {
    // Checks to see which site they are work at the most (basically checking what their main site is)
    const RCH = [];
    const SMH = [];
    const RH = [];
    for (const shift of shifts) {
        if (shift.siteId === 1) {
            RCH.push(shift)
        } else if (shift.siteId === 2) {
            SMH.push(shift)
        } else if (shift.siteId === 3) {
            RH.push(shift)
        }
    }
    if (RCH.length > SMH.length && RCH.length > RH.length) {
        return 'RCH'
    } else if (SMH.length > RCH.length && SMH.length > RH.length) {
        return 'SMH'
    } else if (RH.length > RCH.length && RH.length > SMH.length) {
        return 'RH'
    }
}

const convertSiteId = (shift) => {
    // Used by the function convertShiftType() to get the site name
    if (shift.siteId === 1) {
        return 'RCH';
    } else if (shift.siteId === 2) {
        return 'SMH';
    } else if (shift.siteId === 3) {
        return 'RH';
    }
}

const convertShiftType = (type, allShifts, shift) => {
    const site = findMainSite(allShifts)
    if (allShifts.length === 0) {
        return 0
    } else {
        if (type === 'NIGHT') {
            return 'N'
        } else if (type === 'EVENING') {
            return 'E'
        } else if (type === 'DAY') {
            return 'D'
        } else if (type === 'SICK') {
            return 'S'
        }
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

router.get("/resources", async (req, res) => {
    const allUsersInSection = [];
    if (req.user.role === Role.STUDENT && req.user.shifts.length >= 1) {
        allUsersInSection.push({
            id: req.user.id,
            name: req.user.name,
            site: findMainSite(req.user.shifts),
            dayshifts: countShifts(req.user.shifts, 'DAY'),
            nightshifts: countShifts(req.user.shifts, 'NIGHT'),
            eveningshifts: countShifts(req.user.shifts, 'EVENING'),
            totalshifts: countShifts(req.user.shifts, 'ALL')
        })
    } else if (req.user.role === Role.INSTRUCTOR || req.user.role === Role.ADMIN) {
        const allStudents = await User.all();
        for (let student of allStudents) {
            if (student.sectionId === req.user.section.id && student.shift.length >= 1 && student.id !== req.user.id && student.role === Role.STUDENT) {
                allUsersInSection.push({
                    id: student.id,
                    name: student.name,
                    site: findMainSite(student.shift),
                    dayshifts: countShifts(student.shift, 'DAY'),
                    nightshifts: countShifts(student.shift, 'NIGHT'),
                    eveningshifts: countShifts(student.shift, 'EVENING'),
                    totalshifts: countShifts(student.shift, 'ALL')
                })
            }
        }
    }
    res.json(allUsersInSection)
})

router.get("/events", async (req, res) => {
    const shiftDays = [];
    if (req.user.role === Role.STUDENT) {
        for (const shift of req.user.shifts.filter(s => s.status !== 'DELETED')) {
            shiftDays.push({
                title: convertShiftType(shift.type, req.user.shifts, shift),
                start: shift.date.toISOString().split("T")[0],
                resourceId: req.user.id,
                color: shiftColor(shift.type)
            })
        }
    } else {
        // Users who are instructors or admins
        const allStudents = await User.all();
        for (let student of allStudents) {
            for (let shift of student.shift.filter(s => s.status !== 'DELETED')) {
                if (student.sectionId === req.user.section.id && student.shift.length >= 1) {
                    shiftDays.push({
                        title: convertShiftType(shift.type, student.shift, shift),
                        start: shift.date.toISOString().split("T")[0],
                        resourceId: student.id,
                        color: shiftColor(shift.type)
                    })
                }
            }
        }
    }
    res.json(shiftDays)
})

module.exports = router;
