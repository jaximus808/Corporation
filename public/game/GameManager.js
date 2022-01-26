const socket = io(); 

var gameStart = false; 
var iconWidth = 50;
var imgs = []
var imgRoutes = ["./assets/ceo.png","./assets/yobama.jpg" ]
var zoomScale = 1;
var cameraPosX = 0;
var cameraPosY = 0; 
function preload()
{
    for(let i = 0; i < imgRoutes.length; i++ )
    {
        imgs.push(loadImage(imgRoutes[i]))
    }
}

class Player
{
    constructor(name,money,pieceId)
    {
        this.name = name;
        this.money = money;
        this.pieceId = pieceId; 
        this.position = 0; 
        //will load this thing later
    }

    SetState(_pos, _money)
    {
        this.position = _pos; 
        this.money = _money;
    }
}

const boardMap = {}; 

class MainPlayer
{
    constructor(name)
    {
        this.name = name;   
    }
}

//localplayer will be in another area
let mainPlayer = new MainPlayer("default")
let players = {};

function FocusedInput()
{
    return document.getElementById('username') != document.activeElement || document.getElementById('iconId') != document.activeElement ||document.getElementById('chatinput') != document.activeElement
}

function UpdatePlayers()
{
    const playerDispay = document.getElementById("playerDisplayer")
    playerDispay.innerHTML = ""
    let playerKeys = Object.keys(players)
    for(let i = 0; i < playerKeys.length; i++)
    {
        //will stylize better later
        playerDispay.innerHTML += `<h2>${players[playerKeys[i]].name}</h2><p>Money: $${players[playerKeys[i]].money}</p> <img class="iconpfp" src=${imgRoutes[players[playerKeys[i]].pieceId]}>`
    }
}

var windowW = window.innerWidth*0.8

var windowH = window.innerHeight
function JoinGame()
{
    let icon = parseInt(document.getElementById("iconId").value); 
    let name = document.getElementById("username").value;
    
    if(parseInt(icon) < 0) 
    {
        document.getElementById("status").innerHTML = "Please input a number for the icon"
        return; 
    }

    console.log(name)
    socket.emit("joinGame", name, icon);
    document.getElementById("initSettings").style.display="none"
    mainPlayer.name = name
}
function RenderMessage(content)
{
    var chatContainer = document.getElementById("chatContianer");
    var chatP = document.createElement("p");
    chatP.setAttribute("class", "message");
    chatP.innerHTML =` ${content}` ;
    chatContainer.prepend(chatP)
}

window.onresize = () =>{
    
    windowW = window.innerWidth*0.8

    windowH = window.innerHeight
    resizeCanvas(windowW, windowH);
    multi = window.innerHeight/1000 * zoomScale;
    xoffset = (windowW/2 -((rectW*multi*9+widthW*multi))/2)/multi;

    yoffset = ((windowH-(rectW*multi*9+widthW*multi+widthW*multi))/2)
    
    
    background(color(138, 138, 138))   
}

function DisconnectPlayers(name) 
{
    delete players[name]
}


function setup()
{
    textAlign(CENTER,CENTER)
    createCanvas(windowW,windowH)
    rectMode(CENTER)
    background(color(138, 138, 138))   
} 
console.log(windowH)
var widthW = 100;
var rectW = 80

let multi = windowH/1000 * zoomScale
    

var xoffset = (windowW/2 -((rectW*multi*9+widthW*multi))/2)/multi;

var yoffset = ((windowH-(rectW*multi*9+widthW*multi+widthW*multi))/2)
console.log(yoffset)

function SendMessageDom()
{
    const message = document.getElementById("chatinput").value;
    if(!message.trim()) return;
    document.getElementById("chatinput").value = "";
    socket.emit("sendMessage", message )
}

boardMap[20] = 
    {
        x: xoffset*multi,
        y: (yoffset+widthW/2)*multi
    }

    boardMap[30] =
    {
        x: (xoffset+(rectW*9+widthW))*multi,
        y: (yoffset+widthW/2)*multi
    }
    boardMap[0] = 
    {
        x:(xoffset+(rectW*9+widthW))*multi,
        y: (yoffset+(rectW*9+widthW)+widthW/2)*multi
    }
    boardMap[10] =
    {
        x: xoffset*multi,
        y: (yoffset+(rectW*9+widthW)+widthW/2)*multi
    }
    for(let i = 1; i < 10; i++)
    {
        boardMap[i] = 
        {
            x: (xoffset+rectW*i+rectW/8)*multi,
            y:  (yoffset+widthW/2)*multi
        }
        boardMap[i+20] = 
        {
            x: (xoffset+rectW*i+rectW/8)*multi,
            y: (yoffset+(rectW*9+widthW)+widthW/2)*multi
        }
        
    }
function draw()
{
    
    clear();
    
    background(color(138, 138, 138))  
    stroke(1)
    //large corners
    multi = windowH/1000 * zoomScale
    boardMap[20] = 
    {
        x: xoffset*multi,
        y: (yoffset+widthW/2)*multi
    }

    boardMap[30] =
    {
        x: (xoffset+(rectW*9+widthW))*multi,
        y: (yoffset+widthW/2)*multi
    }
    boardMap[0] = 
    {
        x:(xoffset+(rectW*9+widthW))*multi,
        y: (yoffset+(rectW*9+widthW)+widthW/2)*multi
    }
    boardMap[10] =
    {
        x: xoffset*multi,
        y: (yoffset+(rectW*9+widthW)+widthW/2)*multi
    }
    for(let i = 1; i < 10; i++)
    {
        boardMap[i+20] = 
        {
            x: (xoffset+rectW*i+rectW/8)*multi,
            y:  (yoffset+widthW/2)*multi
        }
        boardMap[(10-i)] = 
        {
            x: (xoffset+rectW*i+rectW/8)*multi,
            y: (yoffset+(rectW*9+widthW)+widthW/2)*multi
        }
        boardMap[(10-i)+10] = 
        {
            x: xoffset*multi,
            y: (yoffset+rectW*i+10+widthW/2)*multi
        }
        boardMap[i+30] = 
        {
            x:(xoffset+810+widthW/10)*multi,
            y:(yoffset+rectW*i+10+widthW/2)*multi
        }        
    }


    for(let i = 1; i < 10; i++)
    {
        
        rect(boardMap[i].x,boardMap[i].y, rectW*multi,widthW*multi )
        
        rect(boardMap[i+20].x ,boardMap[i+20].y,rectW*multi,widthW*multi )
        
        rect(boardMap[i+10].x,boardMap[i+10].y, widthW*multi, rectW*multi)
        
        rect(boardMap[i+30].x ,boardMap[i+30].y,widthW*multi, rectW*multi)
    }
    
    // for(let i = 1; i < 10; i++)
    // {
        
    //     rect(boardMap[i+10].x,boardMap[i+10].y, widthW*multi, rectW*multi)
        
    //     rect(boardMap[i+30].x ,boardMap[i+30].y,widthW*multi, rectW*multi)
    //     // rect(xoffset*multi, (yoffset+rectW*i+10+widthW/2)*multi, widthW*multi,rectW*multi )
        
    //     // rect((xoffset+810+widthW/10)*multi, (yoffset+rectW*i+10+widthW/2)*multi, widthW*multi,rectW*multi )
    // }
    rect(boardMap[20].x, boardMap[20].y, widthW*multi, widthW*multi)
    
    rect(boardMap[30].x, boardMap[30].y, widthW*multi, widthW*multi)
    
    rect(boardMap[0].x, boardMap[0].y, widthW*multi, widthW*multi)
    
    rect(boardMap[10].x, boardMap[10].y, widthW*multi, widthW*multi)
    if(keyIsDown(13))
    {
        SendMessageDom();
    }
    if(keyIsDown(81))
    {
        console.log("??")
        if(FocusedInput())
        {
            
            zoomScale += 0.1;
        }
    }
    if(keyIsDown(69))
    {
        if(FocusedInput())
        {
            
            zoomScale -= 0.1;
        }
    }
    if(!gameStart) return;
    let pKeys = Object.keys(players);  
    for(let i = 0; i <pKeys.length; i++)
    {
        //players[pKeys[i]].position
        imgs[players[pKeys[i]].pieceId].resize(iconWidth, iconWidth)
        image(imgs[players[pKeys[i]].pieceId],boardMap[players[pKeys[i]].position].x -iconWidth/2,boardMap[players[pKeys[i]].position].y-iconWidth/2)
    }
}

socket.on("chatMessage", (content) =>
{
    RenderMessage(content)
}) 

socket.on("RenderInitGameState", (_data) =>
{
    const data = JSON.parse(_data)
    console.log(players)
    console.log(data)
    for(let i = 0; i < data.players.length; i++)
    {
        players[data.players[i].name] = new Player(data.players[i].name,data.players[i].money,data.players[i].pieceId);
    }
    UpdatePlayers();
}) 

socket.on("gamestart", (_data) =>
{
    const data = JSON.parse(_data)
    console.log(data)
    console.log(players)
    for(let i = 0; i < data.playerInfo.length; i++)
    {
        players[data.playerInfo[i].name].SetState(data.playerInfo[i].pos, data.playerInfo[i].money)
    }
    gameStart = true;

} )

socket.on("UpdateState", (_data) =>
{
    const data = JSON.parse(_data)
    console.log(data)
    for(let i = 0; i < data.playerInfo.length; i++) 
    {

        players[data.playerInfo[i][0]].position = data.playerInfo[i][1];
        players[data.playerInfo[i][0]].money = data.playerInfo[i][2];
        players[data.playerInfo[i][0]].state = data.playerInfo[i][3];
    }
    UpdatePlayers(); 
})

socket.on("UpdatePlayers", (_data) =>
{
    const data = JSON.parse(_data)
    console.log("wtf?")
    console.log(data)
    if(data.delete) DisconnectPlayers(data.name);
    else 
    {
        players[data.name] = new Player(data.name,data.money, data.pieceId);
        UpdatePlayers();
    }
})