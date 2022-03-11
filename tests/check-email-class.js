const { exec } = require('child_process');
const assert = require('assert');

const Email = require('../classes/email');
const User = require("../models/user");
const Role = require("../models/role");
const Section = require("../models/section");

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL_TESTING;

describe('Test email functionality', () =>{

    beforeEach(() => {
        exec('npx prisma migrate reset --force');
    });

    it('sendToAdmins method only sends to administrators who have email notifications on', async () => {
        const adminEmails = [];
        const users = await User.all();

        for (const user of users) {
            if (user.role === Role.ADMIN && user.emailNotifications) {
                adminEmails.push(user.email);
            }
        }

        assert.deepEqual(adminEmails, await Email.getAdminRecipients());
    });

    it('sendToSectionInstructor method only sends to administrators who have email notifications on', async () => {
        let instructorEmail;

        const section = await Section.find(2);
        const instructor = await User.find(section.instructorId);

        if (instructor.emailNotifications) {
            instructorEmail = instructor.email;
        } else {
            instructorEmail = null;
        }

        assert.equal(instructorEmail, await Email.getSectionInstructorRecipient(2));
    });
});
