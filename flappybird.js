let board;
let boardWidth=360;
let boardHeight=640;
let context;
//bird
let birdwidth=34;
let birdheight=24;
let birdx=boardWidth/8;
let birdy=boardHeight/2;
let birdImg;

let bird={
    x: birdx,
    y: birdy,
    width:birdwidth,
    height:birdheight
}

//pipes
let pipeArray=[];
let pipewidth=64;
let pipeheight=512;
let pipex=boardWidth;
let pipey=0;

let topPipeImg;
let bottomPipeImg;
let velocityx=-2;//pipes moving left speed
let velocityY=0;//bird jump speed
let gravity=0.4;
let gameOver=false;
let score=0;

window.onload=function()
{
   board= document.getElementById("board");
   board.height=boardHeight;
   board.width=boardWidth;
   context=board.getContext("2d");

//    context.fillStyle="green"
//  context.fillRect(bird.x,bird.y,bird.width,bird.height);
   birdImg=new Image();
   birdImg.src="./flappybird.png";
   birdImg.onload=function(){
    context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);
   }
   topPipeImg=new Image();
   topPipeImg.src="./toppipe.png";

   bottomPipeImg=new Image();
   bottomPipeImg.src="./bottompipe.png";
   requestAnimationFrame(update);
   setInterval(placePipes,2500);
   document.addEventListener("keydown",moveBird);
}

function update(){
    requestAnimationFrame(update);
    if(gameOver)
    {
        return;
    }
    context.clearRect(0,0,board.width,board.height);
    //bird
    velocityY+=gravity;
    //bird.y +=velocityY;
    bird.y=Math.max(bird.y+velocityY,0);// apply gravity to current bird.y,limit the bird to top of the canvas

    context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);
    if(bird.y>board.height)
    {
        //for falling down bird to say gameover
        gameOver=true;
    }
    //pipes
    for(let i=0;i<pipeArray.length;i++)
    {
        let pipe=pipeArray[i];
        pipe.x+=velocityx;
        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);
        if(!pipe.passed && bird.x > pipe.x+pipe.width)
        {
            score+=0.5//because there are 2 pipes
            pipe.passed=true;
        }
        if(detectCollision(bird,pipe))
        {
            gameOver=true;
        }
    }
    //clear pipes
    while(pipeArray.length>0 && pipeArray[0].x < -pipewidth )
    {
        pipeArray.shift();//removes 1st element
    }
    //score
    context.fillStyle="white";
    context.font="45px sans-serif";
    context.fillText(score,5,45);
    if(gameOver){
        context.fillText("Game Over",5,90);
    }
}
function placePipes(){
    if(gameOver)
    {
        return;
    }
    let randomPipeY=pipey- pipeheight/4-Math.random()*(pipeheight/2);
    let openingSpace=board.height/4;
    let topPipe={
        img: topPipeImg,
        x:pipex,
        y:randomPipeY,
        width:pipewidth,
        height:pipeheight,
        passed:false
    }
    pipeArray.push(topPipe);

    let bottompipe={
        img:bottomPipeImg,
        x:pipex,
        y:randomPipeY+pipeheight+openingSpace,
        width:pipewidth,
        height:pipeheight,
        passed:false
    }
    pipeArray.push(bottompipe);
}
function moveBird(e){
    if(e.code=="Space" || e.code=="ArrowUp" || e.code =="KeyX")
    {
        //jump
        velocityY=-6;
        //reset game
        if(gameOver){
            bird.y=birdy;
            pipeArray=[];
            score=0;
            gameOver=false;
        }
    }
}
function detectCollision(a,b){
    return a.x<b.x +b.width &&
    a.x+a.width>b.x &&
    a.y<b.y +b.height &&
    a.y +a.height >b.y;
}