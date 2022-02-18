// This route page is mainly used to fetch data to the calendar in the dashboard page using JSON

const express = require('express');
const router = express.Router();

const date = new Date()

const User = require('../models/User');

// All the functions created to be used for the "Resources" and "Events" columns for fullcalendar.io
const countShifts = (shifts, shiftType) => {
    let shiftCounter = 0;
    const currentMonthYear = `${convertMonth(date.getMonth())} ${date.getFullYear()}`
    if (shifts.length === 0) {
        return 0;
    }

    for (const shift of shifts) {
        const shiftMonth = new Date(shift.date)
        const monthYear = `${convertMonth(shiftMonth.getMonth())} ${shiftMonth.getFullYear()}`
        if (shiftType === 'ALL') {
            if (monthYear === currentMonthYear) {
                shiftCounter += 1
            }
        }
        else if (monthYear === currentMonthYear && shift.type === shiftType) {
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
        }
        else if (shift.siteId === 2) {
            SMH.push(shift)
        }
        else if (shift.siteId === 3) {
            RH.push(shift)
        }
    }
    if (RCH.length > SMH.length && RCH.length > RH.length) {
        return 'RCH'
    }
    else if (SMH.length > RCH.length && SMH.length > RH.length) {
        return 'SMH'
    }
    else if (RH.length > RCH.length && RH.length > SMH.length){
        return 'RH'
    }
}

const convertSiteId = (shift) => {
    // Used by the function convertShiftType() to get the site name
    if (shift.siteId === 1) {
        return 'RCH';
    }
    else if (shift.siteId === 2) {
        return 'SMH';
    }
    else if (shift.siteId === 3) {
        return 'RH';
    }
}

const convertShiftType = (type, allShifts, shift) => {
    const site = findMainSite(allShifts)
    if (allShifts.length === 0) {
        return 0
    } else {
        if (convertSiteId(shift) === site) {
            if (type === 'NIGHT') {
                return 'N'
            }
            else if (type === 'EVENING') {
                return 'E'
            }
            else if (type === 'DAY') {
                return 'D'
            }
            else if (type === 'SICK') {
                return 'S'
            }
        } else {
            if (type === 'NIGHT') {
                return `N, ${convertSiteId(shift)}`
            }
            else if (type === 'EVENING') {
                return `E, ${convertSiteId(shift)}`
            }
            else if (type === 'DAY') {
                return `D, ${convertSiteId(shift)}`
            }
            else if (type === 'SICK') {
                return `S, ${convertSiteId(shift)}`
            }
        }
    }
}

const shiftColor = (shift) => {
    if (shift === 'NIGHT') {
        return '#744468'
    }
    else if (shift === 'EVENING') {
        return '#016BB7'
    }
    else if (shift === 'DAY') {
        return '#ECA446'
    }
    else if (shift === 'SICK') {
        return '#D05353'
    }
}

const convertMonth = (monthNum) => {
    return [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ][monthNum];
}

router.get("/resources", async (req,res) => {
    const allUsersInSection = [];
    if (req.user.role === 'STUDENT' && req.user.shifts.length >= 1) {
        allUsersInSection.push({
            id: req.user.id,
            name: req.user.name,
            site: findMainSite(req.user.shifts),
            dayshifts: countShifts(req.user.shifts, 'DAY'),
            nightshifts: countShifts(req.user.shifts, 'NIGHT'),
            eveningshifts: countShifts(req.user.shifts, 'EVENING'),
            totalshifts: countShifts(req.user.shifts, 'ALL')
        })
    } else if (req.user.role === 'INSTRUCTOR') {
        const allStudents = await User.all();
        for (let student of allStudents) {
            if (student.sectionId === req.user.section.id && student.shift.length >= 1) {
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

router.get("/events", async(req,res) => {
    const shiftDays = [];
    if (req.user.role === 'STUDENT') {
        for (const shift of req.user.shifts) {
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
            for (let shift of student.shift) {
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
