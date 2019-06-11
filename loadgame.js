
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
        var healthamount = 200;
        var tabascolevel = 0; /* maximum health amount, displayed in bottom corner using ctx.Rect*/
        var orgheight, orgwidth; /* original height and width of the base_image*/
        var x = 0;
        var bossimg = document.createElement("img");
        bossimg.src = "bossimg.png";
        var tabasimg = document.createElement("img");
        tabasimg.src = "tabasimg.png";
        var amountlost = 0;
        var btns = []; /* array to record the keypresses and their boolean values*/
        var counter = 0; /* counter variable that records the number of loops the game has gone through*/
        var playerimg = document.createElement("img"); /* player img, changed when the ship is customized*/
        if(pickship==1){
          playerimg.src="noflame3.png";
        }
        if(pickship==2){
          playerimg.src="noflame2.png";
        }
        if(pickship==3){
          playerimg.src="noflame1.png";
        }
        if(pickship==4){
          playerimg.src="myship.png";
        }
        var bullimg = document.createElement("img"); /* bullet img*/
        bullimg.src = "bullet.png";
        var ebullimg = document.createElement('img'); /* enemy bullet img*/
        ebullimg.src = "bullet.png";
        var bulletlist = []; /* array to record bullet objects*/
        var counter2 = 0;
        var base_image2 = document.createElement("img"); /* base_image2 is the img that the playerimg changes to when the W key is pressed so that a booster is shown at the back*/
        if(pickship==1){
          base_image2.src="shipflame4.png";
        }
        if(pickship==2){
          base_image2.src="shipflame3.png";
        }
        if(pickship==3){
          base_image2.src="shipflame2.png";
        }
        if(pickship==4){
          base_image2.src="mygoodship.png";
        } /* variable source so that our customization page on the other page can change*/
        base_image2.width = playerimg.width;
        base_image2.height = playerimg.height;
        var base_image3 = document.createElement("img"); /* enemy img*/
        base_image3.src = "enemyplayer.png";
        var enemx, enemy,enemtotdist,enemdis1,enemdis2; /* random variables for the generation of the enemies*/
        var bossx, bossy, bosstotdist, bossdis1, bossdis2, bossang, bossspeed; /* random variables for the generation of bosses*/
        var boostimg = document.createElement("img"); /* boostimg*/
        boostimg.src = "easyd.png";
        var enemang,enemspeed; /* directional variables for the enemies*/
        var timeout= 0; /* timeout for the users bullets*/
        var shieldshad = 0; /* shield shadow number, dicates the ctx.ShadowBlur value for many elements*/
        var planet1 = document.createElement("img"); /* Earth*/
        planet1.src = "planet1.png";
        var planet2 = document.createElement("img");/* Purple Planet*/
        planet2.src = "planet2.png";
        var planet3 = document.createElement("img");/* Green*/
        planet3.src = "planet3.png";
        var planet4 = document.createElement("img");/* Brown Planet*/
        planet4.src = "planet4.png";
        var planetList = [];/* array of planets*/
        var randPlan = Math.floor(Math.random()*3);/* chooses a random planet in which authorization is given to land, so that once tobasco is collected, game can be won*/


        base_image.onload = function () { /* ensures that at least one image is loaded before doing map generations*/
            diffCheck();/* calls function so that difficulty level can be checked and health can be set*/
            realGen();


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
            for(var i of plaList){
             enemdis1 = i.x - enemx;
             enemdis2 = i.y - enemy;}
             enemspeed = Math.random()*2;
             enemang = (Math.atan(enemdis2/enemdis1))*(180/Math.PI);
             enemtotdist = Math.sqrt(enemdis1*enemdis1 + enemdis2*enemdis2);
        }
        function BossGen(){
            bossx = Math.floor(Math.random() * (5000 - -5000 + 1)) - 5000;
            bossy = Math.floor(Math.random() * (5000 - -5000 + 1)) - 5000;
            for(var i of plaList){
             bossdis1 = i.x - bossx;
             bossdis2 = i.y - bossy;}
             bossspeed = Math.random()*2;
             bossang = (Math.atan(enemdis2/enemdis1))*(180/Math.PI);
             bosstotdist = Math.sqrt(bossdis1*bossdis1 + bossdis2*bossdis2);
        }
            
        
        function realGen(){
            for (j=0; j<=43;j++){ /* generates enemies, all over the map*/
                enemGen();
               
                enemyList.push(new enemyClass(enemx,enemy,enemtotdist,enemang,enemspeed)); /* enemy object passed to respective array*/
                enemang+=270; /* angle changed to accomodate for the tilt of the image itself, pointed upwards, so at 90 degrees.*/
                if(enemang<0){
                    enemang+=360;
                }
            }
            for(var z=0; z<=10;z++){
                BossGen();
                while(bosstotdist<=500){
                BossGen();}
                if(bosstotdist>500){
                bosslist.push(new BossClass(bossx,bossy,bosstotdist,bossang,bossspeed));
                bossang+=270;
                if(bossang<0){
                    bossang+=360
                }
            }}

            }


        var imgList = []; /* imgList is an array to store all the asteroids*/
        var boostlist = []; /* array to hold all the boosts that are created*/
        var starList = []; /* array that holds all stars*/

        class imageClass { /* image object that holds all the attributes needed for the collision and movement of the asteroids*/
            constructor(img, x, y, ang, speed,rot, size, h , w,bool1) { /* constructor to define the variables passed when creating a new object*/
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
                this.bool1 = bool1;
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
                

            }

        }
        class BossClass{
            constructor(x,y,dist,ang,speed,health){
                this.img = bossimg;
                this.x = x;
                this.y = y;
                this.dist = dist;
                this.ang = ang;
                this.w = 350;
                this.h = 450;
                this.speed = speed;
                this.health = 0;
        }}
        class BossHit{
            constructor(x,y){
                this.x = x; 
                this.y = y;
                this.w = 350;
                this.h = 450;
            }
        }
        class enemyHit{ /* enemy hitbox object*/
            constructor(x,y){
                this.x = x;
                this.y = y;
                this.w = 20;
                this.h = 20;
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
                this.h = 10;
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
           drawp3(); /* draws the 3rd planet*/
           drawHealth(); /* draws the healthbar in each loop, displays the variable healthamount, which is the health of the player*/
           DrawTabas(); /* draws the level of tabasco each loop, depending on how much you've collected*/
            SearchInsert(); /* sets the shadowblur property to a circle around the player, so that when the value is increased, a halo can be seen around the player*/
            bulletShoot();/* checks for keypress and shoots a bullet*/
            hitlist2= []; /* array for asteroids*/
             hitlist = []; /* array for player*/

             setHitbox(); /* sets the circular hitboxes of objects in the game*/
            checkColl(); /* uses the aforementioned hitboxes to check for collisions and perform the mandated action*/
            hitlist3 = []; /* enemy array*/
            hitlist4 = [];/* array for bullets(player)*/
            hitlist5 = [];
            AlertDisp(); /* displays the alerts that are active due to the actions of the player */
            plaMove(); /* function to move the player object on keypresses*/
            drawTrail();/* draws the trail objects behind the ship*/
            enShoot(); /* at intervals, shoots bullets from the enemies to the player*/
            smalltrue = false; /* boolean to decide whether the player is small/landed */
            wrongplan = false; /* boolean to check whether the currently focused planet is authorized, and does the alert if not*/
           
                countin = 0;
                 ctx.restore(); /* restores the ctx back to the original positions, so that player movement is actually the movement of the objects around it and the canvas as a whole*/

            while(enemyList.length<=1){
                realGen();
            }
         counter++;/* counter increases each loop for intervaled actions*/
         }
var enemyList = []; /* enemy array*/
var bosslist = []; /* boss array*/
var hitlist= []; /* player hitbox array*/
var hitlist2 = []; /* asteroid hitbox array*/
var hitlist3 = []; /* enemy hitbox array*/
var hitlist4 = []; /* bullet hitbox array*/
var hitlist5 = []; /*boss array*/
var countin = 0;
var tabascolist = [];

        function setHitbox(){ /* this functions pushes the hitboxes for any collision detectable objects into arrays which are later iterated through*/
            for (var i of plaList){
            hitlist.push(new PlayHit(i.x,i.y,i.w));}
            for (var i of imgList){
            hitlist2.push(new ImageHit(i.x,i.y,i.w,i.h,i.size));}

            for (var i of enemyList){
            hitlist3.push(new enemyHit(i.x,i.y));

            }
            for (var i of bosslist){
                hitlist5.push(new BossHit(i.x,i.y));
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

                if (distance < hitlist[0].w + i.w && countin == randPlan && tabascolevel>=200){ /* if collision is happening, and the planet is the one you are authorized to enter using the random generator, allow for collision reaction*/
                        smalltrue = true;
                        ctx.clearRect(0,0,10000,10000);
                        clearInterval(looper);
                        var mainc = document.createElement('h1');
                        mainc.innerHTML = "You have won";
                        mainc.style.marginTop = "0%";
                        mainc.style.color = "blue";
                        mainc.style.zIndex = "20";
                        document.getElementById('maindiv').append(mainc);

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
                for (var q = 0; q<hitlist4.length;q++){ /* if player bullets are colliding with.....*/
                    for (var h = 0;h<hitlist3.length;h++) { /*the enemy players*/
                    var distance2 = Math.hypot(hitlist3[h].x - hitlist4[q].x, hitlist3[h].y - hitlist4[q].y); /* distance calc*/
                    if(distance2 < 30){ /* if less than radii*/        
                    tabascolist.push(new imageClass(tabasimg,hitlist3[h].x,hitlist3[h].y,0,0,0,1,140,140,true));  
                    bulletlist.splice(q,1); /* remove the bullet from the array*/
                    enemyList.splice(h,1);
                    hitlist3.splice(h,1); /*insta kills the smaller enemies, removed from system*/
                    
                        console.log(enemyList);
                    }
                }}
                for (var o = 0;o<hitlist4.length;o++) { /* player bullets*/
                for (var y = 0; y<hitlist5.length;y++){ /* bosses*/
                    var distance2 = Math.hypot(hitlist4[o].x - hitlist5[y].x, hitlist4[o].y - hitlist5[y].y); /* distance calc*/
                    if(distance2 < 50){ /* if less than radii*/          /* insta kill*/  /* log health*/
                    bulletlist.splice(o,1); /* remove the bullet from the array*/
                    bosslist[y].health++;
                    if(bosslist[y].health>5){
                    tabascolist.push(new imageClass(tabasimg,hitlist5[y].x,hitlist5[y].y,0,0,0,1,240,240,true));
                    tabascolist.push(new imageClass(tabasimg,hitlist5[y].x,hitlist5[y].y,0,0,0,1,240,240,true));
                    tabascolist.push(new imageClass(tabasimg,hitlist5[y].x,hitlist5[y].y,0,0,0,1,240,240,true));
                    bosslist.splice(y,1);
                    hitlist5.splice(y,1); /* if the enemy health is 0, remove it, it dies*/
                    console.log(bosslist);}
                        
                    
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
                healthamount-=0.10; /* if the boost isn't active, take away 0.10 from the player's health (per bullet)*/
            }
            if(shielded){
                healthamount-=0.01; /* if boost is active, lower the damage rate*/
            }
            if(healthamount<=0){
                clearInterval(looper); /* if health is 0, clear the interval*/
                ctx.clearRect(0,0,10000,10000);
                        var mainc = document.createElement('h1'); /* create an h1 element to show loss*/
                        mainc.innerHTML = "You have Lost"; /* set the element's text*/
                        mainc.style.marginTop = "0%"; 
                        mainc.style.color = "red";
                        mainc.style.zIndex = "20";
                        document.getElementById('maindiv').append(mainc);
            }

             }
function AlertDisp(){ /* alert display function, many different conditions regarding the game*/
    if (healthamount<25&&counter%4==0){ /* If low health, display*/
        ctx.font = "15px Lumbok";
        ctx.fillStyle = "red";
        ctx.fillText("<<LOW HEALTH>>", hitlist[0].x + 550 , hitlist[0].y+265);
}
    if(wrongplan== true&& counter%4==0){ /* if the ship is on the wrong planet*/
        ctx.font = "20px Lumbok"
        ctx.fillStyle = "purple"
        ctx.fillText("<<NO AUTHORIZATION TO ENTER PLANET>>", hitlist[0].x+550, hitlist[0].y+355);


    }


}


function plaMove(){ /* PLAYER MOVEMENT FUNCTION*/ 
    // We have chosen to do a car like movement, that is, a and d rotate the ship, and w and s move the ship in the direction of the rotation
    
        var velocity2p = 0; /* velocity that is altered to move the ship; rate of movement*/

                    if(btns[65]){ /* if a is being pressed*/
                        plaList[0].ang--; /*rotate the ship*/
                    }
                    if(btns[68]){
                        plaList[0].ang++; /* vice versa for d*/
                    }
                    if(btns[87]){ /* if w is being pressed*/
                        velocity2p++; /* increase velocity*/
                        plaList[0].img = base_image2; /* the following changes are width and height changes, in order to accomodate for the pictures not being scaled perfectly. Furthermore, the change in image appends the back flame on the ship*/
                        if(pickship==1){
                          plaList[0].w = 90;
                          plaList[0].h = 115;
                        }
                        if(pickship==2){
                          plaList[0].w = 90;
                          plaList[0].h = 115;
                        }
                        if(pickship==3){
                          plaList[0].w = 90;
                          plaList[0].h = 115;
                        }
                        if(pickship==4){
                          plaList[0].w = 70;
                            plaList[0].h = 95;
                        }
                            if(smalltrue===true){ /* boolean to check whether the ship is supposed to shrink or not*/
                                plaList[0].w = 5 ;
                                plaList[0].h = 5 ;}



                    }
                    if(!btns[87]){ /* If w is not being pressed, return the ship to its original state without the changes*/
                        plaList[0].img = playerimg;


                              if(pickship==1){
                                plaList[0].w = 90;
                                plaList[0].h = 115;
                              }
                              if(pickship==2){
                                plaList[0].w = 90;
                                plaList[0].h = 115;
                              }
                              if(pickship==3){
                                plaList[0].w = 90;
                                plaList[0].h = 115;
                              }
                              if(pickship==4){
                                plaList[0].w = 70;
                                  plaList[0].h = 70;
                              }
                              if(smalltrue===true){
                                plaList[0].w = 5;
                                plaList[0].h = 5;
                            }


                    }
                    if(btns[83]){ /* if s is being pressed, move the ship backwards in relevance to the rotation*/
                        velocity2p--;
                    }
                   // if(i.ang <= Math.PI){
                    plaList[0].x+=Math.cos((plaList[0].ang+270)*Math.PI/180)*velocity2p*1.5;
                    plaList[0].y+=Math.sin((plaList[0].ang+270)*Math.PI/180)*velocity2p*1.5;//}
                 //   else{
                    // i.x-=Math.cos((i.ang+270)*Math.PI/180)*velocity2p;
                  //  i.y-=Math.sin((i.ang+270)*Math.PI/180)*velocity2p;
                  //  }
                // // if(!btns[87]){ 
                // // ctx.save();
                // // ctx.translate(plaList[0].x,plaList[0].y);
                // // ctx.rotate(plaList[0].ang*Math.PI/180);
                // // ctx.drawImage(plaList[0].img, -plaList[0].w/2, -plaList[0].h/2, plaList[0].w, plaList[0].h);
                // // ctx.restore();}
                // else{
                ctx.save();
                ctx.translate(plaList[0].x,plaList[0].y);
                ctx.rotate(plaList[0].ang*Math.PI/180);
                ctx.drawImage(plaList[0].img, -plaList[0].w/2, (-plaList[0].h/2)+11, plaList[0].w, plaList[0].h);
                ctx.restore();}
                // }


function drawSun(){ /* Draw the large sun at the "center" of the game" */
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
function drawp1(){ /* Draw Earth*/
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
    ctx.font = "50px Lumbok";
    ctx.strokeStyle = "white";
    ctx.strokeText('"Earth"',950,1070);

}
function drawp2(){ /* Draw purple planet*/
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
    ctx.font = "50px Lumbok";
    ctx.strokeStyle = "white";
    ctx.strokeText('"Zerkos"',2150,4270);

}
function drawp3(){ /* draw green planet*/
    ctx.drawImage(planet3,-1000,2000,1200,1200);
    ctx.beginPath();
    ctx.arc(-400,2600,600,0,Math.PI*2);
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.save();
    ctx.shadowBlur = 20;
    ctx.shadowColor = "rgba(0,220,100,1)";
    ctx.fill();
    ctx.restore();
    planetList.push(new PlanetClass(-400,2600,600));
    ctx.font = "50px Lumbok";
    ctx.strokeStyle = "white";
    ctx.strokeText('"Vulcan"',-300,2600);

}
function drawHealth(){ /* draw health bar function*/

    ctx.beginPath();
    ctx.fillStyle = "grey";
    ctx.rect(hitlist[0].x + 545, hitlist[0].y+270,210,50);
    ctx.fill();
    ctx.beginPath();
    ctx.rect(hitlist[0].x + 550 , hitlist[0].y+275, healthamount, 40); /* in relevance with the player so that it is always drawn on screen, bottom right corner*/
    if(healthamount>200){ /* if health is more than 200, it stays at 200*/
        healthamount = 200;
    }
    if(healthamount>150){ /* if health is greater than 150, make the bar green*/
    ctx.fillStyle = "green";
    ctx.fill();}
    else if (healthamount>100){ /* change of colors as health goes down, simply by changing fillStyle*/
    ctx.fillStyle = "yellow";
    ctx.fill();}
    else if(healthamount>50){
        ctx.fillStyle = "orange";
        ctx.fill();}
    else{
        ctx.fillStyle = "red";
        ctx.fill();}

      
    }
    function DrawTabas(){ /* Draw Tabasco Bar to indicate how much tabasco you have*/
        ctx.beginPath();
        ctx.fillStyle = "grey";
        ctx.rect(hitlist[0].x + 545, hitlist[0].y+300,210,50);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = "purple"
        ctx.rect(hitlist[0].x + 550 , hitlist[0].y+305, tabascolevel, 20); /* also in relevance with player, just like health bar*/
        ctx.fill();
    }
    var shielded = false;
    function addTimeout(){ /* time out for boosts, if the boost times out, make the effects(shielding) stop and the boost circle itself dissappear*/
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




var traillist = []; /* array for trail particles, blue*/
function drawTrail(){
    if(btns[87]){ /* if w is pressed, push more trail particles to the array so they can be drawn*/
        traillist.push(new trail(plaList[0].x, plaList[0].y, 10, 0));
    }
}
function bulletShoot(){ /* bullet shooting function for player*/
    if(damage==0){/* depending on the level of the upgrade, the counter value goes down, meaning that the bullets will shoot faster, thereby increasing net damage*/
    if(btns[16]&&counter%40==0){
        bulletlist.push(new bulletClass(bullimg, plaList[0].x, plaList[0].y, 40,40,0, plaList[0].ang,2,0));}}

   else if(damage==1){
    if(btns[16]&&counter%35==0){
        bulletlist.push(new bulletClass(bullimg, plaList[0].x, plaList[0].y, 40,40,0, plaList[0].ang,2,0));}    
       
    }
   else if(damage==2){
        if(btns[16]&&counter%30==0){
            bulletlist.push(new bulletClass(bullimg, plaList[0].x, plaList[0].y, 40,40,0, plaList[0].ang,2,0));}    
    
        }
      else if(damage==3){
            if(btns[16]&&counter%25==0){
                bulletlist.push(new bulletClass(bullimg, plaList[0].x, plaList[0].y, 40,40,0, plaList[0].ang,2,0));}    
        
            }
           else if(damage==4){
                if(btns[16]&&counter%20==0){
                    bulletlist.push(new bulletClass(bullimg, plaList[0].x, plaList[0].y, 40,40,0, plaList[0].ang,2,0));}    
            
                }
               else if(damage==5){
                    if(btns[16]&&counter%15==0){
                        bulletlist.push(new bulletClass(bullimg, plaList[0].x, plaList[0].y, 40,40,0, plaList[0].ang,2,0));}    
                
                    }
                 else   if(damage==6){
                        if(btns[16]&&counter%10==0){
                            bulletlist.push(new bulletClass(bullimg, plaList[0].x, plaList[0].y, 40,40,0, plaList[0].ang,2,0));}    
                    
                        }

}




function allDraw(){ /* main drawing functions with for loops regarding the drawing methods of all objects*/
    if(counter%200==0){
        for (var i of imgList) {
            i.ang = Math.random()*Math.PI*2; /* at a short interval, change the angle/vector of movement for the asteroids.*/


    }}
    if(counter%200==0){ /* at the same intervale, regenerate health at a predefined rate that can be upgraded*/
        if(healthamount<200&&healthamount>0){
            healthamount+= regenrate;
        }
    }
    if (counter==1){ /* at the very beginning of the game, change the sizes of the asteroids to a randomly generated size using a multiplier*/
        for (var i of imgList){
        i.w = i.w*i.size;
        i.h = i.h*i.size;

        ;}
    }
    for (var i of imgList) { /* randomly move around the asteroids at a random angle, at a random speed*/ 

        i.x += Math.cos(i.ang)*i.speed;
        i.y -= Math.sin(i.ang)*i.speed;
        ctx.drawImage(i.img, i.x, i.y, i.w, i.h);


    }
    for(var i of bulletlist){ /* draw all the active bullets that have been shot and haven't timed out yet*/
        ctx.drawImage(i.img, i.x, i.y, i.w, i.h);
        while(i.rot<0){ /* because negative angles cause issues, we simply add 2pi or 360 degrees such that the angular direction itself doesnt change, it just becomes positive*/
            i.rot= i.rot + 360;

        }

        i.x+=2*Math.cos((i.rot+270)*Math.PI/180)*i.speed;
        i.y+=2*Math.sin((i.rot+270)*Math.PI/180)*i.speed;
        i.totdist++;

    }
    for(var i of boostlist){ /* for all elements in the boost arrray, continuously calculate the distance between a point on the booster and the player*/

        var idist = Math.sqrt((i.x-plaList[0].x)*(i.x-plaList[0].x)+(i.y-plaList[0].y)*(i.y-plaList[0].y));
         if (idist<=25){ /* if the distance is smaller than 25, collision, meaning that the boost gets activated*/
           i.bool1 = true;

         }
        ctx.drawImage(i.img,i.x,i.y,i.w,i.h);
}
for(var i of tabascolist){ /*same principal as above except for tabasco*/
    var idist = Math.sqrt((i.x-plaList[0].x+20)*(i.x-plaList[0].x+20)+((i.y+35)-plaList[0].y)*((i.y+35)-plaList[0].y));
   if(i.bool1){
    ctx.drawImage(i.img,i.x,i.y,i.w,i.h); /* if the tabasco hasn't been collected or generated by killing an enemy, draw it, otherwise the tabasco is not drawn*/
   }

    if(idist<=55&&i.bool1){ /* if the distance between the bottle of tabasco and player is less than 55, collision, and so tabasco level goes up and image stops getting drawn*/
        i.bool1=false; 
        tabascolevel+=2; 
        console.log("point");
    }
    
    
}

    for (var i of enemyList){ /* movement for enemy players*/
        i.ang = Math.atan2(plaList[0].y - i.y, plaList[0].x - i.x) + Math.PI/2; /* angle becomes angle between player and enemy*/
        i.dist = Math.sqrt((plaList[0].x - i.x)*(plaList[0].x - i.x)+(plaList[0].y - i.y)*(plaList[0].y - i.y)); /* distance is calculated, math.hypot caused issues here so I resorted to using Math.sqrt and simply inputting pythagorean theorum. */
        ctx.save(); /* saves the canvas before moving it to rotate the ship on itself*/
        ctx.translate(i.x,i.y); /* translates the canvas to the position of the ship*/
        ctx.rotate(i.ang); /* rotates in the direction of the player*/
        ctx.drawImage(i.img,-i.w/2,-i.h/2,i.w,i.h);/* drawn in the original spot*/
        ctx.restore();
        if(i.dist<=10000&&i.dist>=200){ /* if it is in range, bring the ship close*/
        i.x+=1*Math.cos(i.ang- Math.PI/2);
        i.y+=1*Math.sin(i.ang - Math.PI/2);}

        else if(i.dist<=200){ /* if too close, move backwards, gives natural feeling to movement*/
        i.x-=1*Math.cos(i.ang- Math.PI/2);
        i.y-=1*Math.sin(i.ang - Math.PI/2);
        }}

        for (var i of bosslist){ /* same code as above, simply altered for the boss ships, which are slightly bigger*/
            i.ang = Math.atan2(plaList[0].y - i.y, plaList[0].x - i.x) + Math.PI/2;
            i.dist = Math.sqrt((plaList[0].x - i.x)*(plaList[0].x - i.x)+(plaList[0].y - i.y)*(plaList[0].y - i.y));
            ctx.save();
            ctx.translate(i.x,i.y);
            ctx.rotate(i.ang);
            ctx.drawImage(i.img,-i.w/2,-i.h/2,i.w,i.h);
            ctx.restore();
            if(i.dist<=1000&&i.dist>=400){
            i.x+=1*Math.cos(i.ang- Math.PI/2);
            i.y+=1*Math.sin(i.ang - Math.PI/2);}
    
            else if(i.dist<=400){
            i.x-=1*Math.cos(i.ang- Math.PI/2);
            i.y-=1*Math.sin(i.ang - Math.PI/2);
            }}


       for (var i of starList){ /* generates forefronts stars to give parallax feeling*/
        ctx.beginPath();
        ctx.arc(i.x,i.y,i.rad,0,2*Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();

    }
    for(var i of enemybullet){ /* movement for enemy bullets, in the original direction of the ship*/
        i.dist = Math.sqrt((plaList[0].x - i.x)*(plaList[0].x - i.x)+(plaList[0].y - i.y)*(plaList[0].y - i.y));
        i.x+=5*Math.cos(i.rot- Math.PI/2);
        i.y+=5*Math.sin(i.rot - Math.PI/2);
        ctx.drawImage(ebullimg,i.x,i.y,i.w,i.h);
        i.totdist++;
    }
    for(var i of enemybullet){ /* enemy bullet gets removed to reduce lag, after travelling 1000 units*/
        if(i.totdist>1000){
            enemybullet.splice(i,1);
        }
    }
    for (var i of traillist){ /* drawing of jet fuel behind ship, slowly fades away as the width of the particle gets smaller and smaller*/
        if(i.dist>20){
        ctx.beginPath();
        ctx.arc(i.x,i.y,i.w,0,Math.PI*2);
        ctx.fillStyle = "rgba(0,120,255,0.02)";
        ctx.shadowBlur = 2;
        ctx.shadowColor = "rgba(220,0,0,0.02)";
        ctx.fill();
        i.w-=0.20;
        }
    if(i.dist>60){ /* at a certain point, remove the particle altogether*/ 
        traillist.splice(i,1);
    }

    i.dist++;
    }
}
var enemybullet =[];
function enShoot(){ /* set timing for enemy shots*/
    for(var i of enemyList){
    if (counter%400==0&&i.dist<=400){
        enemybullet.push(new bulletClass(ebullimg,i.x,i.y,10,10,0,Math.atan2(plaList[0].y - i.y, plaList[0].x - i.x) + Math.PI/2,2,0));

    }
    for(var i of bosslist){
        if (counter%20==0&&i.dist<=400){
            enemybullet.push(new bulletClass(ebullimg,i.x,i.y,30,30,0,Math.atan2(plaList[0].y - i.y, plaList[0].x - i.x) + Math.PI/2,2,0));
    
        }

}}}
