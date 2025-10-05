import { Server } from "socket.io";

const authenticatedUsers = [];

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
    });
}
