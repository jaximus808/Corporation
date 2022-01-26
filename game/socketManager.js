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
            if(!socket.handshake.headers.cookie) return
            let cookies = this.cookie.parse(socket.handshake.headers.cookie)
            const roomToken = cookies.roomAuthToken
            if(!roomToken)
            {
                console.log("error with roomAuthToken")
                
            }
            if(!this.rooms[roomToken]) return;

            socket.join(roomToken)
            let playerOb = this.rooms[roomToken].players; 
            let playerArray = [];
            for(let i = 0; i < Object.keys(playerOb).length; i++)
            {
                let curPlay = playerOb[Object.keys(playerOb)[i]]; 
                playerArray.push(
                    {
                        name:curPlay.name,
                        money: curPlay.money,
                        pieceId: curPlay.pieceIcon
                    }
                )
            }
            console.log(playerArray)
            socket.emit("RenderInitGameState", JSON.stringify(
                {
                    players: playerArray
                }
            ))
            
            socket.on("joinGame", (username, pieceId) =>
            {
                if(parseInt(pieceId) < 0) return; 
                this.rooms[roomToken].AddPlayer(socket.id, username, pieceId )
                this.io.to(roomToken).emit('UpdatePlayers', JSON.stringify(
                    {
                        delete: false,
                        name: username,
                        money: this.rooms[roomToken].players[socket.id].money,
                        pieceId: this.rooms[roomToken].players[socket.id].pieceIcon
                    }
                ));
                
            })
            socket.on("sendMessage", (message) =>
            {
                this.rooms[roomToken].ChatHandler(socket.id, message)
            })
            socket.on("disconnect", ()=>
            {
                // need to delete gaemlogic
                if(!this.rooms[roomToken].players[socket.id]) return;
                socket.broadcast.to(roomToken).emit('UpdatePlayers', JSON.stringify(
                    {
                        delete: true,
                        name: this.rooms[roomToken].players[socket.id].name
                    }
                ));
                this.rooms[roomToken].DisconnectPlayer(socket.id) 
            })
        })
        this.ioSet = true; 
    }

}
const socketManager = new SocketManager();
module.exports = socketManager