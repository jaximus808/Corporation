class Player
{
    constructor(name, id, state, pieceIconId)
    {
        this.name = name;
        this.id = id; 
        //state: 0 waiting, 1 ingame, 2 spectating
        this.state = state; 
        this.money = 0
        this.pieceIcon = pieceIconId
    }
}

module.exports = Player