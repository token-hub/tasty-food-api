import UserModel from "./model.js";
import { ObjectId } from "mongodb";

class UserService {
    #model;

    constructor() {
        this.#model = UserModel;
    }

    get model() {
        return this.#model;
    }

    transformData(data) {
        if (data.userId) {
            data.userId = new ObjectId(data.userId);
        }
    }

    createUser(data) {
        // add validation
        const user = this.model.create(data);

        // send email verification email
        return user;
    }

    updateUser(data) {
        // add validations
        this.transformData(data);

        return this.model.findOneAndUpdate(
            {
                _id: data.userId
            },
            { $set: data },
            { new: true, runValidators: true }
        );
    }
    getUser() {}

    // login() {}
    // logout() {}
    // resendVerification() {}
    // verifyUser() {}
}

export default UserService;
