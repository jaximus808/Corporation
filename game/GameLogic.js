class GameLogic 
{
    constructor(maxPlayers, roomId)
    {
        this.maxplayers = maxPlayers;
        this.playerCount = 0;
        this.socket = require("./socketManager")
        this.roomId = roomId;
        this.players = {}
        this.state = 0;
        this.playerClass = require("./Player")
        //0 means waiting, 1 means in game 
    }

    AddPlayer(id, name, iconId )
    {
        if(this.state == 0)
        {

            this.players[id] = new this.playerClass(name,id,0,iconId )
    
        }
        else
        {
            this.players[id] = new this.playerClass(name,id,2,iconId )
            
        }
        console.log(this.players)
    }


}

module.exports = GameLogic