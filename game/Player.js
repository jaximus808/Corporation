class Player
{
    constructor(name, id, state, pieceIconId,host)
    {
        this.name = name;
        this.id = id; 
        //state: 0 waiting, 1 ingame, 2 spectating
        this.state = state; 
        this.money = 0
        this.pieceIcon = pieceIconId
        this.host = host
        this.position = 0; 
    }
}

module.exports = Player