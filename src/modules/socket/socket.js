import { Server } from "socket.io";

let authenticatedUsers = [];

export function createSocket(server) {
    const io = new Server(server, { cors: { origin: process.env.CLIENT_URL, methods: ["GET", "POST"] } });
    io.on("connection", (socket) => {
        const userId = socket.handshake.auth.userId;

        if (userId) {
            console.log("New connection:", socket.id);
            const exist = authenticatedUsers.some((user) => userId === user.id);
            if (exist) {
                authenticatedUsers = authenticatedUsers.map((user) => {
                    if (userId === user.id) {
                        return { ...user, socketId: socket.id };
                    } else {
                        return user;
                    }
                });
            } else {
                authenticatedUsers.push({ id: userId, socketId: socket.id });
            }

            console.log(authenticatedUsers);
        }

        socket.on("get-users", () => {
            socket.emit("users", authenticatedUsers);
        });

        socket.on("authenticate", (data) => {
            console.log("Authenticate event received:", data);
            if (data.id) {
                authenticatedUsers.push({ id: data.id, socketId: socket.id });
                socket.broadcast.emit("users", authenticatedUsers);
            }
        });

        socket.on("logout", (data) => {
            console.log("user has loggout: ", data);
            authenticatedUsers = authenticatedUsers.filter((user) => user.id !== data.id);
            io.emit("users", authenticatedUsers);
        });

        socket.on("private-message", (data) => {
            console.log("Private Message:", data);
            const targetUser = authenticatedUsers.find((user) => user.id === data.to);
            if (targetUser) {
                io.to(targetUser.socketId).emit("private-message", data);
            } else {
                console.log("Target user not found:", data.to);
            }
        });
    });
}
