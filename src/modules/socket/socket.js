import { Server } from "socket.io";

let authenticatedUsers = [];

export function createSocket(server) {
    const io = new Server(server, { cors: { origin: process.env.CLIENT_URL, methods: ["GET", "POST"] } });

    io.on("connection", (socket) => {
        socket.on("get-users", () => {
            socket.emit("users", authenticatedUsers);
        });

        socket.on("authenticate", (data) => {
            console.log("Authenticate event received:", data);
            if (data.id && data.socketId) {
                authenticatedUsers.push({ id: data.id, socketId: data.socketId });
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
                io.to(targetUser.socketId).emit("private-message", data.message);
            } else {
                console.log("Target user not found:", data.to);
            }
        });
    });
}
