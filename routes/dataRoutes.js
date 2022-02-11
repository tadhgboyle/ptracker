// This route page is mainly used to fetch data to the calendar in the dashboard page using JSON

const express = require('express');

const router = express.Router();

// Authentication of Instructor
const {isInstructor} = require('../middleware/checkAuth')

// User Class
const User = require('../models/User');

const countShifts = (shifts, shiftType) => {
    if (shifts.length === 0) {
        return;
    } else {
        let shiftCounter = 0;
        for (const shift of shifts) {
            if (shift.type == shiftType) {
                shiftCounter += 1
            }
        }
        return shiftCounter
    }
}

const convertShiftType = (type) => {
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
}

const convertSiteID = (site) => {
    if (site === 1) {
        return 'RCH'
    }
    else if (site === 2) {
        return 'SMH'
    }
    else if (site === 3) {
        return 'RH'
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

router.get("/resources", async (req,res) => {
    const allUsersInSection = [];
    if (req.user.role === 'STUDENT' && req.user.shifts.length >= 1) {
        allUsersInSection.push({
            id: req.user.googleId,
            name: req.user.name,
            site: convertSiteID(req.user.shifts[0].siteId),
            dayshifts: countShifts(req.user.shifts, 'DAY'),
            nightshifts: countShifts(req.user.shifts, 'NIGHT'),
            totalshifts: req.user.shifts.length
        })
    } else if (req.user.role === 'INSTRUCTOR') {
        const allStudents = await User.all();
        for (let student of allStudents) {
            if (student.sectionId == req.user.section.id && student.shift.length >= 1) {
                allUsersInSection.push({
                    id: student.googleId,
                    name: student.name,
                    site: convertSiteID(student.shift[0].siteId),
                    dayshifts: countShifts(student.shift, 'DAY'),
                    nightshifts: countShifts(student.shift, 'NIGHT'),
                    eveningshifts: countShifts(student.shift, 'EVENING'),
                    totalshifts: student.shift.length
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
                title: convertShiftType(shift.type),
                start: shift.date.toISOString().split("T")[0],
                resourceId: req.user.googleId,
                color: shiftColor(shift.type)
            })
        }
    } else {
        // Users who are instructors or admins
        const allStudents = await User.all();
        for (let student of allStudents) {
            for (let shift of student.shift) {
                if (student.sectionId == req.user.section.id && student.shift.length >= 1) {
                    shiftDays.push({
                        title: convertShiftType(shift.type),
                        start: shift.date.toISOString().split("T")[0],
                        resourceId: student.googleId,
                        color: shiftColor(shift.type)
                    })
                }
            }
        }
    }
    res.json(shiftDays)
})

module.exports = router;