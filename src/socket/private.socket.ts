export = (io: any) => {
    io.on("connection", (socket: any) => {
        socket.on("join chat", (pm: any) => {
            socket.join(pm.room1);
            socket.join(pm.room2);
        });
        socket.on("private message",(message:any,callback:any)=>{
          io.to(message.room).emit("new message",{
              text:message.text,
              sender:message.sender,
              senderId:message.senderId
          });
          io.emit('message display',{});
          callback();
        })
    });
}