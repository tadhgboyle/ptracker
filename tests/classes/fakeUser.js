const Role = require('../../models/role');

module.exports = class User {

    constructor(id = 1, name = 'Ben Dover', role = Role.STUDENT, shifts = {}, emailNotif = false, sectionId = 1) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.shifts = shifts;
        this.emailNotif = emailNotif;
        this.section = {
            id: sectionId
        };
    }

}
