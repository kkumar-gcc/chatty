"use strict";
module.exports = (io) => {
    io.on("connection", (socket) => {
        socket.on("join chat", (pm) => {
            socket.join(pm.room1);
            socket.join(pm.room2);
        });
        socket.on("private message", (message, callback) => {
            io.to(message.room).emit("new message", {
                text: message.text,
                sender: message.sender,
                senderId: message.senderId
            });
            io.emit('message display', {});
            callback();
        });
    });
};