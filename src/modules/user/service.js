import UserModel from "./model.js";

class UserService {
    #model;

    constructor() {
        this.#model = UserModel;
    }

    get model() {
        return this.#model;
    }

    transformData(data) {}

    createUser(data) {
        // add validation
        const user = this.model.create(data);

        // send email verification email
        return user;
    }

    updateUser() {}
    getUser() {}

    // login() {}
    // logout() {}
    // resendVerification() {}
    // verifyUser() {}
}

export default UserService;
