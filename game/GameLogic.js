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
        //type: 0 is property, 1 is basic special, 
        /*@param name — name of property

@param cost — cost of property

@param houseCost — cost of buying a house

@param houseTax — inital tax for landing on property, the final tax will be houseTax. with houses

@param multiplier — how much to multiply per house, ex 2 houses will be houseTax * multiplier*n

@param mortgage — mortgage

@param baseRent — base rent with no houses
*/      
        this.special = [(id) =>{
            this.players[id].money -= 200; 
        }, 
        (id) =>
        {
            this.players[id].money += 200
        }]


        this.Property = require("./Property")

        this.boardPieces = [{
            name: "Start", 
            type:1, 
            act: (id) =>
            {
            }
        },
        {
            name: "Brock Buster",
            type:0,
            property: new this.Property("Brock Buster", 60,100, 10, 9, 30, 2)
        },
        {
            name: "Special",
            type:1,
            act: (id) =>
            {
                //for now
                this.special[ Math.floor(Math.random()*this.special.length)](id)
            }
        },
        {
            name: "Games R Us",
            type:0,
            property: new this.Property("Games R Us", 70, 100, 10, 9, 30, 2),
        },
        {
            name: "Sick Tax",
            type:0,
            act: (id) =>
            {
                this.players[id] -= 200
            }
            
        }] 
        this.boardPieces[1].property.Act();
        //0 means waiting, 1 means in game 
    }
     
    Roll()
    {
        return [Math.ceil(Math.random()*6),Math.ceil(Math.random()*6)]
    } 

    PlayMove(id) 
    {
        //need to check if it's the player turns
        const movePlayer = this.players[id]; 
        //states:
        /*
            0: normal
            1: jail 
            2: dead
        */
        if(movePlayer.state == 2) return this.ServerMessage("You are out lmfao")
        var dice = this.Roll(); 
        this.players[id].position += dice[0]+dice[1]
        
        if(this.players[id].position > 39) 
        {
            this.players[id].money += 200;
            this.players[id].position -= 40; 
        }
        //remove this if statement later when all pieces added
        if(this.boardPieces[this.players[id].position])
        {
            if(this.boardPieces[this.players[id].position].type == 0) this.boardPieces[this.players[id].position].act(id)
            else this.boardPieces[this.players[id].position].property.act(id, this.players) 
        }
        //need to check for bankrupt
        this.ServerMessage(`You rolled a ${dice[0]} and a ${dice[1]}!`);
        this.UpdateState([[this.players[id].name, this.players[id].position, this.players[id].money, this.players[id].state]], [])
    }
    

    //name, position, money, state 
    UpdateState(playerInfo, gameInfo)
    {
        this.socket.io.to(this.roomId).emit("UpdateState",JSON.stringify(
            {
                playerInfo: playerInfo,
                gameInfo: gameInfo
            }
        ))
    }

    AddPlayer(id, name, iconId )
    {
        let host = false;
        if(this.playerCount == 0 ) host = true;
        if(this.state == 0)
        {
            
            this.players[id] = new this.playerClass(name,id,0,iconId ,host)
            console.log("HELLO")
            this.ServerMessage("Welcome to the game! Waiting for host to begin...", id)
        }
        else
        {
            this.players[id] = new this.playerClass(name,id,2,iconId,host)
            this.ServerMessage("Welcome to the game! there is already a game running and you will be spectating",id)
        }
        this.playerCount += 1;
        
        
    }

    DisconnectPlayer(id)
    {
        delete this.players[id];  
    }

    CommandHandler(args, id)
    {
        //will contain host comands and normal people commands
        //check normal commands first 
        if(this.players[id].host)
        {
            switch(args[0])
            {
                case "/start":
                    if(this.state == 1) return;
                    this.ServerMessage("Game is starting!");
                    this.GameStart()
                    break;
                case "/roll":
                    if(this.state == 0) return; 
                    this.PlayMove(id);
                    break;
                default:
                    this.ServerMessage("I don't recongize your command");
                    break;
            }
            
        }
    }

    ReturnPlayerInfo()
    {
        let pos = [];
        let keys = Object.keys(this.players)
        for(let i = 0; i < keys.length; i++)
        {
            pos.push(
                {
                    name:this.players[keys[i]].name,
                    pos:this.players[keys[i]].position, 
                    money:this.players[keys[i]].money, 
                }
            )
        }
        return pos; 
    }

    GameStart()
    {
        this.state = 1;
        let keys = Object.keys(this.players)
        for(let i = 0; i < keys.length; i++)
        {
            this.players[keys[i]].money = 2500; 
            this.players[keys[i]].position = 0; 
        }
        this.socket.io.to(this.roomId).emit("gamestart",JSON.stringify({
            playerInfo: this.ReturnPlayerInfo()
        }))
    }

    ServerMessage(content, target = this.roomId)
    {
        this.socket.io.to(target).emit("chatMessage",`<span style="color:#e03ad0">Server</span>: ${content}`)
    }

    ChatHandler(id, content)
    {
        if(content.trim()[0] == "/") 
        {
            let commandArgs = content.trim().split(" ");
            this.CommandHandler(commandArgs, id)
        }
        this.socket.io.to(this.roomId).emit("chatMessage",`<span color="black">${this.players[id].name}</span>: ${content}`)
    }
}

module.exports = GameLogic