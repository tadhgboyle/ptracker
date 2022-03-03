module.exports = class Response {

    json(string) {
        this.json = string;
    }

    getJson() {
        return this.json;
    }

    redirect(location) {
        this.redirect = location;
    }

    getRedirect() {
        return this.redirect;
    }

}
