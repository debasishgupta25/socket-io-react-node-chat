import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
const port = 3001;
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["POST", "GET"]
    }
});

io.on("connection", (socket)=>{
    console.log("User is connected with "+ socket.id);
    socket.on("join_room",(data)=> {
        console.log("User joined room "+ data);
        socket.join(data);
    });
    socket.on("send_message", (data)=> {
        //socket.broadcast.emit("receive_message", data);
        socket.to(data.room).emit("receive_message", data);
    });
});

server.listen(port, ()=>{
    console.log('Server is running.');
});