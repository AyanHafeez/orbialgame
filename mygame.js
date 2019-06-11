            
        window.addEventListener("keydown", function(i){
            btns[i.keyCode] = true;
        });
        window.addEventListener("keyup", function (i){
            btns[i.keyCode] = false;
        });
        var canvas = document.getElementById("myCanv");
        var ctx = canvas.getContext("2d");
        var randomx, randomy, randomang, randomspeed;
        var base_image = document.createElement("img");
        var randomsize;
        var healthamount = 200; 
        var orgheight, orgwidth;
        var x = 0;
        var amountlost = 0;
        var btns = [];
        var counter = 0;
        var playerimg = document.createElement("img");
        playerimg.src = "myship.png"
        var bullimg = document.createElement("img");
        bullimg.src = "bullet.png"

        base_image.src = "aster.png";
        base_image.onload = function () {
            

            for (l=0;l<=500;l++) {
                var randomstar = Math.floor(Math.random() * (2 - 1 + 1)) + 2;
                var randomx2 =  Math.floor(Math.random() * (5000 - -5000 + 1)) - 5000;
                var randomy2 = Math.floor(Math.random() * (5000 - -5000 + 1)) - 5000;
                starList.push(new starHit(randomx2, randomy2, randomstar));

            }

            for (x; x <= 200; x++) {
                randomx = Math.floor(Math.random() * (5000 - -5000 + 1)) - 5000;
                randomy = Math.floor(Math.random() * (5000 - -5000 + 1)) - 5000;
                randomang = Math.random()*Math.PI*2;
                randomspeed = Math.random(1- -1 + 1)-1;
                orgheight = base_image.height;
                orgwidth = base_image.width;
                randomrot = Math.random()*Math.PI*2;
                randomsize = Math.random() * (0.6);
                imgList.push(new imageClass(base_image, randomx, randomy, randomang, randomspeed, randomrot, randomsize, orgheight, orgwidth));

            }
        }

        var imgList = [];
        var starList = [];

        class imageClass {
            constructor(img, x, y, ang, speed,rot, size, h , w) {
                this.x = x;
                this.y = y;
                this.img = img;
                this.ang = ang;
                this.speed = Math.random()*1;
                this.rot = 0.2;
                this.size = size;
                this.h = h*size;
                this.w = w*size;
            }
        }
        class playerClass {
            constructor() {
                this.img = playerimg;
                this.x = canvas.width/2 - 15;
                this.y = canvas.height/2 - 15;
                this.h = 70;
                this.w = 70;
                this.ang = 0;
            }
        }
        class ImageHit{
            constructor(x,y,width,height,size){
                this.x = x+width/2;
                this.y = y+height/2;
                this.w = size*width;
            }
        }
        class PlayHit{
                constructor(x,y,w){
                this.x = x;
                this.y = y;
                this.w = w-20;
                    }
        }
    
        class starHit{
            constructor(x,y,rad){
                this.x = x;
                this.y = y;
                this.rad = rad;
            }
        }


        setInterval(animateAll, 1000 / 600);     // loop
        function animateAll() {
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(canvas.width/2-plaList[0].x, canvas.height/2-plaList[0].y);

                   // clear canvas
            if(counter%200==0){
                for (var i of imgList) {
                    i.ang = Math.random()*Math.PI*2;
                    
            }}
            if (counter==1){
                for (var i of imgList){
                i.w = i.w*i.size;
                i.h = i.h*i.size;

                ;}
            }
            for (var i of imgList) {
                
                i.x += Math.cos(i.ang)*i.speed;
                i.y -= Math.sin(i.ang)*i.speed;
                ctx.drawImage(i.img, i.x, i.y, i.w, i.h);
                 

            }
            for (var i of bulletlist){
      
             ctx.drawImage(bullimg,i.x,i.y,i.w,i.h);
            }
            for (var i of starList){
                ctx.beginPath();
                ctx.arc(i.x,i.y,i.rad,0,2*Math.PI);
                ctx.fillStyle = "white";
                ctx.fill();

            }
           drawSun();
           drawHealth();
           bulletShoot()
            SearchInsert();
            hitlist2= [];
             hitlist = [];
            setHitbox();
            plaMove();
            checkColl(); 
            bulletlist = [];
                 ctx.restore(); 

        
         counter++;
         }

var hitlist= [];
var hitlist2 = [];
var bulletlist = [];
 
        function setHitbox(){
            for (var i of plaList){
            hitlist.push(new PlayHit(i.x,i.y,i.w));}
            for (var i of imgList){
            hitlist2.push(new ImageHit(i.x,i.y,i.w,i.h,i.size));}
            }

     function SearchInsert() {
        for (var i of hitlist){
             ctx.beginPath();
            ctx.arc(i.x,i.y,i.w,0,2*Math.PI);
            ctx.stroke();    
         }
	}

    function checkColl(){
                for (var i of hitlist2){
            var distance = Math.hypot(hitlist[0].x-i.x,hitlist[0].y-i.y, );
            if (distance < hitlist[0].w + i.w){
                // do collision shit 
                healthamount--;
                amountlost++;
                 ctx.beginPath();
                 ctx.arc(i.x,i.y,i.w,0,2*Math.PI);
                 ctx.lineWidth = 10;
                 ctx.stroke();   
                var distancex = hitlist[0].x - i.x;
                var distancey = hitlist[0].y - i.y;
                var radii = i.w + hitlist[0].w;  
                var totdist = Math.sqrt(distancex*distancex + distancey*distancey);
                var offx = distancex / totdist;
                var offy = distancey / totdist;
                hitlist[0].x = i.x + (radii + 1) * offx ;
                hitlist[0].y = i.y + (radii + 1) * offy  ;
                plaList[0].x = hitlist[0].x;
                plaList[0].y = hitlist[0].y;
        
        }
                }   
        }
   // }
   var plaList = [];

        playerimg.onload = function (){
            plaList.push(new playerClass());
            setHitbox();

        }

function plaMove(){
        var velocityp = 0;
        var velocity2p = 0;
                
                    if(btns[65]){
                        plaList[0].ang--;
                    }
                    if(btns[68]){
                        plaList[0].ang++;
                    }
                    if(btns[87]){
                        velocity2p++;
                    }
                    if(btns[83]){
                        velocity2p--;
                    }
                   // if(i.ang <= Math.PI){
                    plaList[0].x+=Math.cos((plaList[0].ang+270)*Math.PI/180)*velocity2p;
                    plaList[0].y+=Math.sin((plaList[0].ang+270)*Math.PI/180)*velocity2p;//}
                 //   else{
                    // i.x-=Math.cos((i.ang+270)*Math.PI/180)*velocity2p;
                  //  i.y-=Math.sin((i.ang+270)*Math.PI/180)*velocity2p;
                  //  }
 
                ctx.save();
                ctx.translate(plaList[0].x,plaList[0].y);
                ctx.rotate(plaList[0].ang*Math.PI/180);
                ctx.drawImage(plaList[0].img, -plaList[0].w/2, -plaList[0].h/2, plaList[0].w, plaList[0].h);
                ctx.restore();
}

function drawSun(){ 
    ctx.beginPath();
    ctx.arc(2500,2500,500,0,Math.PI*2);
    ctx.fillStyle = "yellow";
    ctx.shadowBlur = 20;
    ctx.shadowColor = "white";        
    ctx.fill(); 
    ctx.stroke()

}
function drawHealth(){
    
    ctx.beginPath();
    ctx.fillStyle = "grey";
    ctx.rect(hitlist[0].x + 295 , hitlist[0].y+270,210,50);
    ctx.fill();
    ctx.beginPath();
    ctx.rect(hitlist[0].x + 300 , hitlist[0].y+275, healthamount, 40);
    ctx.fillStyle = "green";
    ctx.shadowBlur = 0;
    ctx.fill();
   
}

function bulletShoot(){
    if(btns[16]){
        bulletlist.push(new imageClass(bullimg, plaList[0].x+60, plaList[0].y+60, plaList[0].ang, 0, 1, 1, 40, 40));
    }


}