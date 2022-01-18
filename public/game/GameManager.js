const socket = io(); 

var windowW = window.innerWidth*0.8

var windowH = window.innerHeight
function JoinGame()
{
    let icon = 1; 
    let name = document.getElementById("username").value;
    console.log(name)
    socket.emit("joinGame", name, icon);
    document.getElementById("initSettings").style.display="none"
}



function setup()
{
    textAlign(CENTER,CENTER)
    createCanvas(windowW,windowH)
    rectMode(CENTER)
    background(color(138, 138, 138))   
} 
var widthW = 100;
var rectW = 80

var xoffset = (windowW-(rectW*9+widthW+widthW))/2;

var yoffset = (windowH-(rectW*9+widthW+widthW))/2;
console.log(yoffset)
function draw()
{
    
    clear();
    
    background(color(138, 138, 138))  
    stroke(1)
    //large corners
    rect(xoffset, yoffset+widthW/2, widthW, widthW)
    rect(xoffset+(rectW*9+widthW), yoffset+widthW/2, widthW, widthW)
    rect(xoffset+(rectW*9+widthW), yoffset+(rectW*9+widthW)+widthW/2, widthW, widthW)
    rect(xoffset, yoffset+(rectW*9+widthW)+widthW/2, widthW, widthW)
    
    for(let i = 1; i < 10; i++)
    {
        
        rect(xoffset+rectW*i+rectW/8, yoffset+widthW/2, rectW,widthW )
        
        rect(xoffset+rectW*i+rectW/8, yoffset+(rectW*9+widthW)+widthW/2, rectW,widthW )
    }
    for(let i = 1; i < 10; i++)
    {
        
        rect(xoffset, yoffset+rectW*i+10+widthW/2, widthW,rectW )
        
        rect(xoffset+810+widthW/10, yoffset+rectW*i+10+widthW/2, widthW,rectW )
    }


}

window.onresize = () =>{
    
    windowW = window.innerWidth*0.8

    windowH = window.innerHeight
    xoffset = (windowW-(rectW*9+widthW+widthW))/2;

    yoffset = (windowH-(rectW*9+widthW+widthW))/2;
    resizeCanvas(windowW, windowH);
    
    background(color(138, 138, 138))   
}