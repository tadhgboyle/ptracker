module.exports = class User {

    constructor(id = null, name = null, role = null, shifts = null, emailNotif = null) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.shifts = shifts;
        this.emailNotif = emailNotif;
    }

}
