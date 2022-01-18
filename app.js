const express = require("express");
const http = require("http")
const app = express();
const server = http.createServer(app);
const {Server} = require("socket.io")
const io = new Server(server);
const path  = require("path")
const cookieParser = require("cookie-parser");

const GameRooms = require("./game/gamerooms")
const SocketManager = require("./game/socketManager");

SocketManager.setIo(io)
app.use(express.json())
app.use(cookieParser())
app.use("/",require("./routes/router"))
app.use("/", express.static(path.join(__dirname, "public","home")))


app.use("/game/gameroom/:roomid", (req, res, next) =>
{
    //check for a token if already in game, do later tho 
    
    if(!req.params.roomid) return res.send("Room Does Not Exist");

    if(!GameRooms[req.params.roomid]) return res.send("Room Does Not Exist");
    
    next(); 
},express.static(path.join(__dirname,"public","game")))


server.listen(3000, () =>console.log("server up"))