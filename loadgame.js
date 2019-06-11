
        window.addEventListener("keydown", function(i){ /* this is a window wide event listener, when a keypressed, it sets the keycode of that key true, by placing it in an array*/
            btns[i.keyCode] = true;
        });
        window.addEventListener("keyup", function (i){ /* when the key is released, that array element is set back to false*/
            btns[i.keyCode] = false;
        });
        var canvas = document.getElementById("myCanv"); /* canvas element*/
        var ctx = canvas.getContext("2d"); /* context of canvas , retrieved on 2d plane*/
        var randomx, randomy, randomang, randomspeed; /* random variable for the generation of the asteroids*/
        var base_image = document.createElement("img"); /* base image of the asteroids*/
        base_image.src = "aster.png";
        var randomsize; /* random multiplier for size of the asteroids*/
        var healthamount = 200; /* maximum health amount, displayed in bottom corner using ctx.Rect*/
        var orgheight, orgwidth; /* original height and width of the base_image*/
        var x = 0; 
        var amountlost = 0;
        var btns = []; /* array to record the keypresses and their boolean values*/
        var counter = 0; /* counter variable that records the number of loops the game has gone through*/
        var playerimg = document.createElement("img"); /* player img, changed when the ship is customized*/
        playerimg.src = "my3ship.png";
        var bullimg = document.createElement("img"); /* bullet img*/
        bullimg.src = "bullet.png";
        var ebullimg = document.createElement('img'); /* enemy bullet img*/
        ebullimg.src = "bullet.png";
        var bulletlist = []; /* array to record bullet objects*/
        var counter2 = 0; 
        var base_image2 = document.createElement("img"); /* base_image2 is the img that the playerimg changes to when the W key is pressed so that a booster is shown at the back*/
        base_image2.src = pickship; /* variable source so that our customization page on the other page can change*/
        base_image2.width = playerimg.width;
        base_image2.height = playerimg.height;
        var base_image3 = document.createElement("img"); /* enemy img*/
        base_image3.src = "enemyplayer.png"; 
        var enemx, enemy,enemtotdist,enemdis1,enemdis2; /* random variables for the generation of the enemies*/
        var boostimg = document.createElement("img"); /* boostimg*/
        boostimg.src = "easyd.png";
        var enemang,enemspeed; /* directional variables for the enemies*/
        var timeout= 0; /* timeout for the users bullets*/
        var shieldshad = 0; /* shield shadow number, dicates the ctx.ShadowBlur value for many elements*/
        var planet1 = document.createElement("img"); /* Earth*/
        planet1.src = "planet1.png";
        var planet2 = document.createElement("img");/* Purple Planet*/
        planet2.src = "planet2.png";
        var planetList = [];/* array of planets*/
        var randPlan = Math.floor(Math.random()*3);/* chooses a random planet in which authorization is given to land, so that once tobasco is collected, game can be won*/

        
        base_image.onload = function () { /* ensures that at least one image is loaded before doing map generations*/
            diffCheck();/* calls function so that difficulty level can be checked and health can be set*/



            for (l=0;l<=200;l++) { /* generates small white stars in the forefront at a random x, random y, and a random size between 1 and 2. */
                var randomstar = Math.floor(Math.random() * (2 - 1 + 1)) + 2;
                var randomx2 =  Math.floor(Math.random() * (5000 - -5000 + 1)) - 5000;
                var randomy2 = Math.floor(Math.random() * (5000 - -5000 + 1)) - 5000;
                starList.push(new starHit(randomx2, randomy2, randomstar)); /* pushed to an array using a custom defined object or class, with preset attributes so that they can be called efficiently when iterating through the array to draw it on every game loop*/

            }

            for (x; x <= 300; x++) { /* makes 300 asteroids, moving at different rates, speeds, angles, and different sizes*/
                randomx = Math.floor(Math.random() * (5000 - -5000 + 1)) - 5000; /* random x*/
                randomy = Math.floor(Math.random() * (5000 - -5000 + 1)) - 5000;/* random y */
                randomang = Math.random()*Math.PI*2; /* random angular direction of movement*/
                randomspeed = Math.random(1- -1 + 1)-1; /* random speed between -1 and 1 in relation to the inverted Cartesian plane*/ 
                orgheight = base_image.height;
                orgwidth = base_image.width;
                randomrot = Math.random()*Math.PI*2;
                randomsize = Math.random()*0.5;
                imgList.push(new imageClass(base_image, randomx, randomy, randomang, randomspeed, randomrot, randomsize, orgheight, orgwidth)); /* pushes the asteroid image to an array as an object with all important attributes "packaged" inside the object*/

            }
            for (j=0; j<=75;j++){ /* generates enemies, all over the map*/
                enemGen();
                if(enemdis1 < 550 ||enemdis2 < 550){ /* regulates distance from the player so spawn killing isnt allowed*/
                    enemGen();
                }
                enemyList.push(new enemyClass(enemx,enemy,enemtotdist,enemang,enemspeed)); /* enemy object passed to respective array*/
                enemang+=270; /* angle changed to accomodate for the tilt of the image itself, pointed upwards, so at 90 degrees.*/
                if(enemang<0){
                    enemang+=360;
                }


            }
        
            var boost1x, boost1y, boost1w,boost1h;

        for (f=0;f<=30;f++){ /* random generates consumbable boost that lowers damage input*/ 
            boost1x = Math.floor(Math.random() * (5000 - -5000 + 1)) - 5000;
            boost1y = Math.floor(Math.random() * (5000 - -5000 + 1)) - 5000;
            boost1w = 25;
            boost1h = 25;
            boostlist.push(new imageClass(boostimg,boost1x,boost1y,0,0,0,1,boost1w,boost1h));


        }

        }
        function enemGen(){ /* generation of random variables such as x and y for enemies*/ 
            enemx = Math.floor(Math.random() * (5000 - -5000 + 1)) - 5000;
            enemy = Math.floor(Math.random() * (5000 - -5000 + 1)) - 5000;
             enemdis1 = plaList[0].x - enemx;
             enemdis2 = plaList[0].y - enemy;
             enemspeed = Math.random()*2;
             enemang = (Math.atan(enemdis2/enemdis1))*(180/Math.PI);
             enemtotdist = Math.sqrt(enemdis1*enemdis1 + enemdis2*enemdis2);
        }

        var imgList = []; /* imgList is an array to store all the asteroids*/
        var boostlist = []; /* array to hold all the boosts that are created*/
        var starList = []; /* array that holds all stars*/

        class imageClass { /* image object that holds all the attributes needed for the collision and movement of the asteroids*/ 
            constructor(img, x, y, ang, speed,rot, size, h , w) { /* constructor to define the variables passed when creating a new object*/
                this.x = x;  
                this.y = y;
                this.img = img;
                this.ang = ang+90;
                this.speed = Math.random()*1;
                this.rot = 0.2;
                this.size = size;
                this.h = h*size;
                this.w = w*size;
                this.timeout = 0;
                this.bool1;
            }
        }
        class playerClass { /* player object*/
            constructor() {
                this.img = playerimg;
                this.x = canvas.width/2 - 15;
                this.y = canvas.height/2 - 15;
                this.h = 70;
                this.w = 70;
                this.ang = 0;
            }
        }
        class enemyClass{ /* enemy object*/
            constructor(x,y,dist,ang,speed,health){
                this.img = base_image3;
                this.x = x;
                this.y = y;
                this.dist = dist;
                this.ang = ang;
                this.w = 70;
                this.h = 70;
                this.speed = speed;
                this.health = 200;
                
            }

        }
        class enemyHit{ /* enemy hitbox object*/
            constructor(x,y){
                this.x = x;
                this.y = y;
                this.w = 20;
                this.h = 20;
                this.health = 200;
            }

        }
        
        class ImageHit{ /* asteroid hitbox object*/
            constructor(x,y,width,height,size){
                this.x = x+width/2;
                this.y = y+height/2;
                this.w = size*width;
            }
        }
        class PlayHit{ /* player hitbox object*/
                constructor(x,y,w){
                this.x = x;
                this.y = y;
                this.w = 45;
                    }
        }

        class starHit{ /* stars object*/
            constructor(x,y,rad){
                this.x = x;
                this.y = y;
                this.rad = rad;
            }
        }
        class bulletClass{ /* bullet image class, for both player and enemies*/
            constructor(img,x,y,w,h,dist,rot,speed,totdist){
                this.img = img;
                this.x = x;
                this.y = y;
                this.w = w;
                this.h = h;
                this.dist = dist;
                this.rot = rot;
                this.speed = speed;
                this.totdist = totdist;
            }
        }
        class bulletHit{ /* bullet hitbox*/
            constructor(x,y){
                this.x = x;
                this.y = y;
                this.w = 10;
                this.h = 110;
            }
        }
        class trail{ /* trail particles object to create fuel effect behind the ship*/
            constructor(x,y,w,dist){
                this.x = x;
                this.y = y;
                this.w = w;
                this.dist = 0;
            }
        }
        class PlanetClass{ /* planet object*/
            constructor(x,y,w){
                this.x = x;
                this.y = y;
                this.w = w;
            }
        }


        var looper = setInterval(animateAll, 1000 / 600);     // this is the game loop, where all the functions of drawing, checking collisions, and updating observations is done here*/
        function animateAll() {

            ctx.clearRect(0, 0, canvas.width, canvas.height); /* clears the canvas each loop so redrawing can happen*/
            ctx.save();
            ctx.translate(canvas.width/2-plaList[0].x, canvas.height/2- plaList[0].y); /* ctx translated to the middle of the players position. All drawing therein is done in relevance to the player, and as such, it seems like the player is moving through the surroundings*/

           allDraw(); /* draws all the objects through the iteration through for loops*/
             addTimeout(); /* this function is the timeout for the glow of the ship when a boost is collected*/
             planetList = []; /* resets the array of planets as the objects are continuously modified and added each loop*/
           drawSun();/* draws the Sun*/
           drawp1();/* draws the 1st planet*/
           drawp2();/* draws the 2nd planet*/
           drawHealth(); /* draws the healthbar in each loop, displays the variable healthamount, which is the health of the player*/
            SearchInsert(); /* sets the shadowblur property to a circle around the player, so that when the value is increased, a halo can be seen around the player*/
            bulletShoot();/* checks for keypress and shoots a bullet*/
            hitlist2= []; /* array for asteroids*/
             hitlist = []; /* array for player*/
             
             setHitbox(); /* sets the circular hitboxes of objects in the game*/
            checkColl(); /* uses the aforementioned hitboxes to check for collisions and perform the mandated action*/
            hitlist3 = []; /* enemy array*/
            hitlist4 = [];/* array for bullets(player)*/
            AlertDisp(); /* displays the alerts that are active due to the actions of the player */
            plaMove(); /* function to move the player object on keypresses*/
            drawTrail();/* draws the trail objects behind the ship*/
            enShoot(); /* at intervals, shoots bullets from the enemies to the player*/
            smalltrue = false; /* boolean to decide whether the player is small/landed */
            wrongplan = false; /* boolean to check whether the currently focused planet is authorized, and does the alert if not*/ 

                countin = 0; 
                 ctx.restore(); /* restores the ctx back to the original positions, so that player movement is actually the movement of the objects around it and the canvas as a whole*/


         counter++;/* counter increases each loop for intervaled actions*/
         }
var enemyList = []; /* enemy array*/
var hitlist= []; /* player hitbox array*/
var hitlist2 = []; /* asteroid hitbox array*/
var hitlist3 = []; /* enemy hitbox array*/
var hitlist4 = []; /* bullet hitbox array*/
var countin = 0;

        function setHitbox(){ /* this functions pushes the hitboxes for any collision detectable objects into arrays which are later iterated through*/
            for (var i of plaList){
            hitlist.push(new PlayHit(i.x,i.y,i.w));} 
            for (var i of imgList){
            hitlist2.push(new ImageHit(i.x,i.y,i.w,i.h,i.size));}
            
            for (var i of enemyList){
            hitlist3.push(new enemyHit(i.x,i.y));
        
            }
            for (var i of bulletlist){  
            hitlist4.push(new bulletHit(i.x+20,i.y+16));
    
            }}


     function SearchInsert() { /* function to set the glow of the ship*/
        for (var i of hitlist){ /* player array*/
            ctx.beginPath();
            ctx.arc(i.x,i.y,i.w,0,2*Math.PI);
            ctx.shadowBlur = shieldshad; /* the actual shadow blur is set to 0 initially, and , under conditions, changes temporarily*/
            ctx.shadowColor = "yellow";

         }
	}
var smalltrue = false; /* aforementioned booleans*/
var wrongplan = false;

    function checkColl(){ /* collision detection function. Uses the arrays of the objects to decide whether or not a collision is occuring. The collisions are all circle circle collisions. The
        general principle for this is to use Math.hypot to find the direct distance between two points on the Cartesian plane. If this distance is smaller than the radii of the 2 objects, collsion!*/
                for (var i of hitlist2){
            var distance = Math.hypot(hitlist[0].x-i.x,hitlist[0].y-i.y); /* distance calc*/
            if (distance < hitlist[0].w + i.w/2){ /* if collisions*/

                HealthLoss(); /* execute health loss functions, function that dictates loss of health*/
                amountlost++; 
                var distancex = hitlist[0].x - i.x;/* exact distance between the x and y values of the two objects*/
                var distancey = hitlist[0].y - i.y;
                var radii = i.w/2 + hitlist[0].w; /* the radius of the two circles*/
                var totdist = Math.sqrt(distancex*distancex + distancey*distancey); /* essentially the same principle as Math.hypot*/
                var offx = distancex / totdist; /*required offset of x*/
                var offy = distancey / totdist;/* vice versa*/
                hitlist[0].x = i.x + (radii + 1) * offx ; /* offsets the difference between the player and the object so that the player cannot enter the other objects*/
                hitlist[0].y = i.y + (radii + 1) * offy  ;
                plaList[0].x = hitlist[0].x; /* sets the image object to the same positions as the hitbox which was moved on collisons*/
                plaList[0].y = hitlist[0].y;
        }}

            for (var i of planetList){ /* iterates through the planets and checks the distance between the player and it to detect collisions*/
                var distance = Math.hypot(hitlist[0].x-i.x,hitlist[0].y-i.y);

                if (distance < hitlist[0].w + i.w && countin == randPlan){ /* if collision is happening, and the planet is the one you are authorized to enter using the random generator, allow for collision reaction*/
                        smalltrue = true;
                    }
                else if(distance<hitlist[0].w+i.w&&countin!=randPlan){ /* if collisions is happening, but you are not authorized, so alert shows*/
                    wrongplan = true;
                }
                countin++;
                }
                for (var i of bulletlist){  /* if the total travel distance of bullets reaches 1000, cap the range*/
                    if(i.totdist>1000){
                        bulletlist.splice(i,1);
                    }
                }
                for(var i of enemybullet){ /* if the distance between the bullet and the player is less than 80, which is an approximation of the two radii, do collsions*/
                    if(i.dist<70+10){
                        HealthLoss();
                    }
                }
                for (var q of hitlist4){ /* if player bullets are colliding with.....*/
                    for(var i of hitlist3){/* the enemy players*/
                    var distance2 = Math.hypot(i.x - q.x , i.y - q.y); /* distance calc*/
                    if(distance2 < i.w/2 + q.w){ /* if less than radii*/
                        i.health-=200;           /* insta kill*/
                        console.log(i.health);   /* log health*/ 
                        bulletlist.splice(i,1); /* remove the bullet from the array*/
                    }
                    if(i.health<=0){
                        enemyList.splice(i,1); /* if the enemy health is 0, remove it, it dies*/
                        console.log(enemyList);
                    }
                }}

            
            
            
            }


            


        
   // }
   var plaList = []; /* player image array*/
   

        playerimg.onload = function (){ /* when the player image is loaded, push player to array*/
            plaList.push(new playerClass());
            setHitbox();/* set the hitbox of the player*/

        }

        function HealthLoss(){ /* health loss functions, checks if certain conditions are active, then removes the health or ends the game*/
            if(!shielded){
                healthamount-=0.2;
            }
            if(shielded){
                healthamount-=0.08;
            }
            if(healthamount<=0){    
                clearInterval(looper);
            }
            
             }
function AlertDisp(){ 
    if (healthamount<25&&counter%4==0){
        ctx.font = "15px Lombok";
        ctx.fillStyle = "red";
        ctx.fillText("<<LOW HEALTH>>", hitlist[0].x + 550 , hitlist[0].y+265);
}
    if(wrongplan== true&& counter%4==0){
        ctx.font = "20px Lombok"
        ctx.fillStyle = "purple"
        ctx.fillText("<<NO AUTHORIZATION TO ENTER PLANET>>", hitlist[0].x+550, hitlist[0].y+335);


    }


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
                        plaList[0].img = base_image2;
                            plaList[0].w = 70;
                            plaList[0].h = 95;
                            if(smalltrue===true){
                                plaList[0].w = 5 ;
                                plaList[0].h = 5 ;}
                       


                    }
                    if(!btns[87]){
                        plaList[0].img = playerimg;
                       
                            plaList[0].w = 70;
                              plaList[0].h = 70;
                              if(smalltrue===true){
                                plaList[0].w = 5;
                                plaList[0].h = 5;
                            }
                        

                    }
                    if(btns[83]){
                        velocity2p--;
                    }
                   // if(i.ang <= Math.PI){
                    plaList[0].x+=Math.cos((plaList[0].ang+270)*Math.PI/180)*velocity2p*1.5;
                    plaList[0].y+=Math.sin((plaList[0].ang+270)*Math.PI/180)*velocity2p*1.5;//}
                 //   else{
                    // i.x-=Math.cos((i.ang+270)*Math.PI/180)*velocity2p;
                  //  i.y-=Math.sin((i.ang+270)*Math.PI/180)*velocity2p;
                  //  }
                if(!btns[87]){
                ctx.save();
                ctx.translate(plaList[0].x,plaList[0].y);
                ctx.rotate(plaList[0].ang*Math.PI/180);
                ctx.drawImage(plaList[0].img, -plaList[0].w/2, -plaList[0].h/2, plaList[0].w, plaList[0].h);
                ctx.restore();}
                else{
                ctx.save();
                ctx.translate(plaList[0].x,plaList[0].y);
                ctx.rotate(plaList[0].ang*Math.PI/180);
                ctx.drawImage(plaList[0].img, -plaList[0].w/2, (-plaList[0].h/2)+11, plaList[0].w, plaList[0].h);
                ctx.restore();}
                }


function drawSun(){
    ctx.beginPath();
    ctx.arc(2500,2500,500,0,Math.PI*2);
    ctx.fillStyle = "yellow";
    ctx.save();
    ctx.shadowBlur = 70;
    ctx.shadowColor = "orange";
    ctx.fill();
    ctx.restore();
    planetList.push(new PlanetClass(2500,2500,500));


}
function drawp1(){
    ctx.drawImage(planet1,800,800,500,500);
    ctx.beginPath();
    ctx.arc(1050,1070,230,0,Math.PI*2);
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.save();
    ctx.shadowBlur = 20;
    ctx.shadowColor = "rgba(0,0,255,1)";
    ctx.fill();
    ctx.restore();
    planetList.push(new PlanetClass(1050,1070,230));

}
function drawp2(){
    ctx.drawImage(planet2,2000,4000,800,800);
    ctx.beginPath();
    ctx.arc(2420,4400,400,0,Math.PI*2);
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.save();
    ctx.shadowBlur = 20;
    ctx.shadowColor = "rgba(102,0,153,1)";
    ctx.fill();
    ctx.restore();
    planetList.push(new PlanetClass(2250,4270,300));

}
function drawHealth(){

    ctx.beginPath();
    ctx.fillStyle = "grey";
    ctx.rect(hitlist[0].x + 545, hitlist[0].y+270,210,50);
    ctx.fill();
    ctx.beginPath();
    ctx.rect(hitlist[0].x + 550 , hitlist[0].y+275, healthamount, 40);
    if(healthamount>200){
        healthamount = 200;
    }
    if(healthamount>150){
    ctx.fillStyle = "green";
    ctx.fill();}
    else if (healthamount>100){
    ctx.fillStyle = "yellow";
    ctx.fill();}
    else if(healthamount>50){
        ctx.fillStyle = "orange";
        ctx.fill();}
    else{
        ctx.fillStyle = "red";
        ctx.fill();}
    }
    var shielded = false;
    function addTimeout(){
      for (var d of boostlist){
        if(d.bool1){
          d.timeout+=0.01;
          shieldshad = 10;
          shielded = true;
        }
        if(d.timeout>=26){
          d.bool1 = false;
          boostlist.splice(d, 1);
          shieldshad = 0;
          shielded = false;
        }
      }
    }


    ctx.shadowBlur = 0;




var traillist = [];
function drawTrail(){
    if(btns[87]){
        traillist.push(new trail(plaList[0].x, plaList[0].y, 10, 0));
    }
}
function bulletShoot(){
    if(btns[16]&&counter%40==0){
        bulletlist.push(new bulletClass(bullimg, plaList[0].x, plaList[0].y, 40,40,0, plaList[0].ang,2,0));
           
    }
   
}




function allDraw(){
    if(counter%200==0){
        for (var i of imgList) {
            i.ang = Math.random()*Math.PI*2;
        

    }}
    if(counter%200==0){
        if(healthamount<200&&healthamount>0){
            healthamount+= regenrate;
        }
    }
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
    for(var i of bulletlist){
        ctx.drawImage(i.img, i.x, i.y, i.w, i.h);
        while(i.rot<0){
            i.rot= i.rot + 360;
            
        }
           
        i.x+=2*Math.cos((i.rot+270)*Math.PI/180)*i.speed;
        i.y+=2*Math.sin((i.rot+270)*Math.PI/180)*i.speed;
        i.totdist++;
    
    }
    for(var i of boostlist){

        var idist = Math.sqrt((i.x-plaList[0].x)*(i.x-plaList[0].x)+(i.y-plaList[0].y)*(i.y-plaList[0].y))
         if (idist<=25){
           i.bool1 = true;
           
         }
        ctx.drawImage(i.img,i.x,i.y,i.w,i.h);
}
    for (var i of enemyList){
        i.ang = Math.atan2(plaList[0].y - i.y, plaList[0].x - i.x) + Math.PI/2;
        i.dist = Math.sqrt((plaList[0].x - i.x)*(plaList[0].x - i.x)+(plaList[0].y - i.y)*(plaList[0].y - i.y));
        ctx.save();
        ctx.translate(i.x,i.y);
        ctx.rotate(i.ang);
        ctx.drawImage(i.img,-i.w/2,-i.h/2,i.w,i.h);
        ctx.restore();
        if(i.dist<=600&&i.dist>=200){
        i.x+=1*Math.cos(i.ang- Math.PI/2);
        i.y+=1*Math.sin(i.ang - Math.PI/2);}
        
        else if(i.dist<=200){
        i.x-=1*Math.cos(i.ang- Math.PI/2);
        i.y-=1*Math.sin(i.ang - Math.PI/2);
        }}


       for (var i of starList){
        ctx.beginPath();
        ctx.arc(i.x,i.y,i.rad,0,2*Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();

    }
    for(var i of enemybullet){
        i.dist = Math.sqrt((plaList[0].x - i.x)*(plaList[0].x - i.x)+(plaList[0].y - i.y)*(plaList[0].y - i.y));
        i.x+=5*Math.cos(i.rot- Math.PI/2);
        i.y+=5*Math.sin(i.rot - Math.PI/2);
        ctx.drawImage(ebullimg,i.x,i.y,i.w,i.h);
    }
    for (var i of traillist){
        if(i.dist>20){
        ctx.beginPath();
        ctx.arc(i.x,i.y,i.w,0,Math.PI*2);
        ctx.fillStyle = "rgba(0,120,255,0.02)";
        ctx.shadowBlur = 2; 
        ctx.shadowColor = "rgba(220,0,0,0.02)";
        ctx.fill();
        i.w-=0.20;
        }
    if(i.dist>60){
        traillist.splice(i,1);
    }

    i.dist++;
    }
}
var enemybullet =[];
function enShoot(){
    for(var i of enemyList){
    if (counter%60==0&&i.dist<=400){
        console.log("bulleter");
        enemybullet.push(new bulletClass(ebullimg,i.x,i.y,10,10,0,Math.atan2(plaList[0].y - i.y, plaList[0].x - i.x) + Math.PI/2,2,0));

    }

}}


