const router = require("express").Router();
const uniqid = require("uniqid")
const GameLogic = require("../game/GameLogic")
const GameRooms = require("../game/gamerooms")

router.post("/management/registerGame", (req,res) =>
{
    //18
    const token = req.cookies.roomAuthToken;
    if(token) 
    {
        res.clearCookie("roomAuthToken"); 
    }
    //will set cookies later after testing
    const maxPlayers = req.body.playerSet;
    if(maxPlayers > 10 || maxPlayers < 3) return res.status(400).send({error:true, message:"Player size Invalid"})
    
    const roomId = uniqid(); 

    GameRooms[roomId] = new GameLogic(maxPlayers,roomId);
    console.log(GameRooms)
    res.cookie(`roomAuthToken`,roomId,{ maxAge: 9000000, httpOnly: true });
    res.send({error:false, message:roomId})
    
})


module.exports = router;