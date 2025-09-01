import { auth } from "../../utils/auth.js";

class AuthService {
    #auth;

    constructor() {
        this.#auth = auth;
    }

    get auth() {
        return this.#auth;
    }

    async signUp(data) {
        // add validation
        // data should have, name, email, and password

        return this.auth.api.signUpEmail({
            body: data
        });
    }
}

export default AuthService;
