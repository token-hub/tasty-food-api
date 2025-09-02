import { auth } from "../../utils/auth.js";

class AuthService {
    #auth;

    constructor() {
        this.#auth = auth;
    }

    get auth() {
        return this.#auth;
    }

    signUp(data) {
        // add validation
        // data should have, name, email, and password

        return this.auth.api.signUpEmail({
            body: data
        });
    }

    login(data, headers) {
        // add validation, make sure that headers is present
        // email and password must be present too
        return this.auth.api.signInEmail({
            body: data,
            headers
        });
    }
}

export default AuthService;
