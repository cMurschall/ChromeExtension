import { TimeOnly } from "./TimeOnly";

export class WorkSpan {
    /**
    Create a TimeOnly instance.
    @param {TimeOnly} login - The time we logged in
    @param {TimeOnly} logout - The time we logged out
    */
    constructor(login, logout) {
        this.login = login;
        this.logout = logout;

    }
}


