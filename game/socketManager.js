class SocketManager
{
    constructor()
    {
        this.ioSet = false;
        this.rooms = require("./gamerooms")
        this.cookie = require("cookie")
    }

    setIo(io)
    {
        this.io = io; 
        this.io.on("connection", (socket) =>
        {
            console.log("IN!")
            let cookies = this.cookie.parse(socket.handshake.headers.cookie)
            const roomToken = cookies.roomAuthToken
            if(!roomToken)
            {
                console.log("error with roomAuthToken")
            }
            socket.on("joinGame", (username, pieceId) =>
            {
                this.rooms[roomToken].AddPlayer(socket.id, username, pieceId )
            })
        })
        this.ioSet = true; 
    }

}
console.log("twice")
const socketManager = new SocketManager();
module.exports = socketManager