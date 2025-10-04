import { Server } from "socket.io";

export function createSocket(server) {
    const io = new Server(server, { cors: { origin: process.env.CLIENT_URL, methods: ["GET", "POST"] } });

    io.on("connection", (socket) => {
        console.log(socket.id); // ojIckSD2jqNzOqIrAGzL
    });
}
