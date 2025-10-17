import { Server } from "socket.io";

class Socket {
    #server;
    #authenticatedUsers = [];

    constructor(server) {
        this.#server = new Server(server, { cors: { origin: process.env.CLIENT_URL, methods: ["GET", "POST"] } });
        this.initilizeListeners();
    }

    get server() {
        return this.#server;
    }

    get authenticatedUsers() {
        return this.#authenticatedUsers;
    }

    set authenticatedUsers(users) {
        return (this.#authenticatedUsers = users);
    }

    initilizeListeners() {
        this.server.on("connection", (socket) => {
            const userId = socket.handshake.auth.userId;

            if (userId) {
                console.log("New connection:", socket.id);
                const exist = this.authenticatedUsers.some((user) => userId === user.id);
                if (exist) {
                    this.authenticatedUsers = this.authenticatedUsers.map((user) => {
                        if (userId === user.id) {
                            return { ...user, socketId: socket.id };
                        } else {
                            return user;
                        }
                    });
                } else {
                    this.authenticatedUsers.push({ id: userId, socketId: socket.id });
                }

                console.log(this.authenticatedUsers);
            }

            socket.on("get-users", () => {
                socket.emit("users", this.authenticatedUsers);
            });

            socket.on("authenticate", (data) => {
                console.log("Authenticate event received:", data);
                if (data.id) {
                    this.authenticatedUsers.push({ id: data.id, socketId: socket.id });
                    socket.broadcast.emit("users", this.authenticatedUsers);
                }
            });

            socket.on("logout", (data) => {
                console.log("user has loggout: ", data);
                this.authenticatedUsers = this.authenticatedUsers.filter((user) => user.id !== data.id);
                this.server.emit("users", this.authenticatedUsers);
            });

            socket.on("private-message", (data) => {
                console.log("Private Message:", data);
                this.emitTo(data.to, "private-message", data);
            });
        });
    }

    emitTo(userId, emitString, data) {
        if (!this.server) return;
        const targetUser = this.authenticatedUsers.find((user) => user.id === userId);
        if (targetUser) {
            this.server.to(targetUser.socketId).emit(emitString, data);
        } else {
            console.log("Target user not found:", data.to);
        }
    }
}

export default Socket;
