
var express = require('express');
var path = require('path');
var app = express();
var server = require('http').Server(app);

/****MONGO DB****/
var mongojs = require("mongojs");
var db = mongojs('127.0.0.1:27017/gameDB',['account']);

//IMPORTING FILES
app.use('/cssFiles', express.static(__dirname + '/assets/css'));
app.use('/jsFiles', express.static(__dirname + '/assets/js'));
app.use('/imgFiles', express.static(__dirname + '/assets/image'));
app.use('/audioFiles', express.static(__dirname + '/assets/audio'));
app.use('/fontFiles', express.static(__dirname + '/assets/fonts'));
app.use('/pageFiles', express.static(__dirname + '/files'));


//LOADING HTML PAGES
app.get('/', function(request, response) {
	response.sendFile(__dirname + '/files/login.html');
});

app.use(express.static('files'));


//LOADING AJAX
// app.get('/help', function(request, response) {
// 	var data = '<h1>Hello</h1>'
// 	response.send(data);
// })

var floor1 = "---";
var room100 = "---";
var room101 = "---";
var room102 = "---";
var room103 = "---";
var room104 = "---";


app.get('/lobby', function(request, response){
	response.sendFile('lobby.html', {root: path.join(__dirname, './files')});
});

app.get('/dead', function(request, response) {
	response.sendFile(__dirname + '/ajax/homepage/dead.txt');
})

app.get('/help', function(request, response) {
    response.sendFile(__dirname + '/ajax/homepage/sample.txt');
})


app.get('/floor1', function(request, response) {
    var data = "<div id='floor1'><center><div id='doors'><img id='exit' src='imgFiles/door/exit.png'/><img onclick='playOpenDoor()' id='door' class='room100' src='imgFiles/door/door100.png'/><img onclick='playOpenDoor()' id='door' class='room101' src='imgFiles/door/door101.png'/><img onclick='playOpenDoor()' id='door' class='room102' src='imgFiles/door/door102.png'/><img onclick='playOpenDoor()' id='door' class='room103' src='imgFiles/door/door103.png'/><img onclick='playOpenDoor()' id='door' class='room104' src='imgFiles/door/door104.png'/></div><img onclick='showFloorLevels()'' id='stairs' src='imgFiles/stairs.png'/><div id='floorlevel'><div id='floortext' class='floor2'><span class='fa fa-angle-double-up'></span><span> Go to 2nd Floor</span></div></div><img id='exitsign' src='imgFiles/exitsign.gif'/></center></div>"
    response.send(data);
})

app.get('/floor1roomfull', function(request, response) {
    var data = "<div id='floor1'><center><div style='background-color:black;color:white;position:absolute;top:0;'><p>SOMEONE IS STAYING IN THIS ROOM</p><button class='okroomfull'>OK</button></div><div id='doors'><img id='exit' src='imgFiles/door/exit.png'/><img onclick='playOpenDoor()' id='door' class='room100' src='imgFiles/door/door100.png'/><img onclick='playOpenDoor()' id='door' class='room101' src='imgFiles/door/door101.png'/><img onclick='playOpenDoor()' id='door' class='room102' src='imgFiles/door/door102.png'/><img onclick='playOpenDoor()' id='door' class='room103' src='imgFiles/door/door103.png'/><img onclick='playOpenDoor()' id='door' class='room104' src='imgFiles/door/door104.png'/></div><img onclick='showFloorLevels()'' id='stairs' src='imgFiles/stairs.png'/><div id='floorlevel'><div id='floortext' class='floor2'><span class='fa fa-angle-double-up'></span><span> Go to 2nd Floor</span></div></div><img id='exitsign' src='imgFiles/exitsign.gif'/></center></div>"
    response.send(data);
})

app.get('/floor2', function(request, response) {
    var data = "<div id='floor2'><center><div id='doors'><img id='exit' src='imgFiles/door/exit.png'/><img id='door' src='imgFiles/door/door200.png'/><img id='door' src='imgFiles/door/door201.png'/><img id='door' src='imgFiles/door/door202.png'/><img id='door' src='imgFiles/door/door203.png'/><img id='door' src='imgFiles/door/door204.png'/></div><img onclick='showFloorLevels()'' id='stairs' src='imgFiles/stairs.png'/><div id='floorlevel'><div id='floortext' class='floor2'><span class='fa fa-angle-double-up'></span><span> Go to 2nd Floor</span></div><div id='floortext' class='floor1'><span class='fa fa-angle-double-down'></span><span> Go to 1st Floor</span></div></div><img id='exitsign' src='imgFiles/exitsign.gif'/></center></div>"
    response.send(data);
})

app.get('/room100', function(request, response) {
  response.sendFile(__dirname + '/ajax/rooms/room100.txt');
})

app.get('/room101', function(request, response) {
    response.sendFile(__dirname + '/ajax/rooms/room101.txt');
})

app.get('/room102', function(request, response) {
    response.sendFile(__dirname + '/ajax/rooms/room102.txt');
})

app.get('/room103', function(request, response) {
    response.sendFile(__dirname + '/ajax/rooms/room103.txt');
})

app.get('/room104', function(request, response) {
    response.sendFile(__dirname + '/ajax/rooms/room104.txt');
})

app.get('/testing', function(request, response) {
    response.sendFile(__dirname + '/ajax/testing.php');
})

app.get('/killerWins', function(request, response) {
    response.sendFile(__dirname + '/ajax/killerwin.txt');
})

app.get('/victimWins', function(request, response) {
    response.sendFile(__dirname + '/ajax/victimwin.txt');
})

app.get('/killerLoses', function(request, response) {
    response.sendFile(__dirname + '/ajax/killerlose.txt');
})


// app.listen(1234, function() {
//  console.log('Listening at Port 1234');
// })


var ENTITY = function(){
    var self = {
    location:"floor1",
    status:"alive"
   }

   return self;
}

var PLAYER_ENTITY = function(data,type,name){

   var play = ENTITY();
   
   //play.location = data;   
   play.username = name;
   play.type = type;
   return play;
}

var SOCKET_LIST = {};

server.listen(process.env.PORT || 1234);
console.log("Listening on port 1234");

var io = require('socket.io')(server, {});
var time = 50;//initial value of timer
var players = [];//player array for those who click 'play' in home.html
var username;
var playerlist={};
var sockets = [];
var killer = "---";
var numberOfPlayers = 0;
var killersTurn = numberOfPlayers;


io.sockets.on('connection',function(socket){
    socket.id = Math.random();
    socket.username = username;

    SOCKET_LIST[socket.id] = socket;

    sockets.push(socket);

    socket.on('disconnect',function(){
        // var index = sockets.indexOf(socket.id);
        // sockets.splice(index,1);
        room100 = "---";
        room101 = "---";
        room101 = "---";
        room103 = "---";
        room104 = "---";
        delete SOCKET_LIST[socket.id];
        
    });


	console.log(socket.id);
    /*********LOGIN********/
    var isValid = function(data,cb){
        db.account.find({username:data.username,password:data.password},function(err,res){
            if(res.length > 0){
                cb(true);
            }else{
                cb(false);
            }
        });
    }

    socket.on('login',function(data){
        isValid(data,function(res){
            if(res){
                username = data.username;
                socket.emit('loginResponse',{success:true});
            }else{
                socket.emit('loginResponse',{success:false});
            }
        });
    });


    /************END**********/

    /*******REGISTER********/
    var isUsernameTaken = function(data,cb){
        db.account.find({username:data.username},function(err,res){
            if(res.length > 0){
                cb(true);
            }else{
                cb(false);
            }
        });
    }

    var registerAccount = function(data,cb){
        db.account.insert({username:data.username,password:data.password},function(err){
            cb();
        });
    }

    socket.on('signUp',function(data){
        isUsernameTaken(data,function(res){
            if(res){
                socket.emit('signUpresponse',{success:false});
            }else{
                loggedIn.push(data.username);
                registerAccount(data,function(){
                    socket.emit('signUpresponse',{success:true});
                });
            }
        });
    });
    /*********END OF REGISTER*********/
    
    //once play button is clicked
    socket.on('play',function(){
        players.push(socket.username);
        /********SYNCHRONIZED TIMER********/
        if(players.length == 1){
            setInterval(function(){
                time-=1;
                io.sockets.emit('timer',{time:time});
                if(time == 0){
                    time = 50;
                }
            },1000);
        }	
        /**********************************/  
    });

    /*************DISPLAY PLAYERS IN LOBBY************/
    setInterval(function(){
        socket.emit('playerList',{players:players,name:socket.username});
    },1000/25);
    /**********************END************************/


    /*********CHAT SYSTEM*********/
	socket.on('sendMsgToServer',function(data){
		var user = socket.username+':'+data;
		if(data){
			io.sockets.emit('addToChat', user);
		}	
	});	

    /*********START CHAT SYSTEM*********/
	socket.on('sendPMToServer', function(data){ //data:{username,message}
		var recipientSocket = null;

		for(var i in SOCKET_LIST){
			if(SOCKET_LIST[i].username === data.username){
				recipientSocket = SOCKET_LIST[i];
			}
		}

		if(recipientSocket === null){
			socket.emit('addToChat', 'The player' + data.username + 'is not online');
		}else{
            socket.emit('addToChat', 'To ' + data.username + ':' + data.message);
			recipientSocket.emit('addToChat', 'From ' + socket.username + ':' + data.message);
			recipientSocket.emit('saddToChat', 'To ' + data.username + ':' + data.message);
		}
	});
	/*********END CHAT SYSTEM*********/


    //start the game
    socket.on('start',function(data){
        console.log("INITIAL GAME LOCATION");
        console.log("room100:"+room100);
        console.log("room101:"+room101);
        console.log("room102:"+room102);
        console.log("room103:"+room103);
        console.log("room104:"+room104);
        console.log("----END----");
             
   

        if(killer == "---"){
            killer = data.currplayer[Math.floor(Math.random()*data.currplayer.length)]; //receives the name of the killer
            numberOfPlayers = data.currplayer.length-1;
            killersTurn = numberOfPlayers;
            console.log(killer);

            
        }
            
        var roletxt = "";
        for(var i in data.currplayer){
            if(data.currplayer[i] == killer){
               var type = "killer";
               //data.currplayer.splice(index,1);
            }else{
               var type = "victim";
            }
            var playerUser = PLAYER_ENTITY(data,type,data.currplayer[i]);
            playerlist[data.currplayer[i]] = playerUser;
            var recipientSocket= null;

            for(var i in SOCKET_LIST){
                if(SOCKET_LIST[i].username === killer){
                    recipientSocket = SOCKET_LIST[i];
                    recipientSocket.emit('roleKill', {role:"You are a Killer"});                  
                }else{
                    recipientSocket = SOCKET_LIST[i];
                    recipientSocket.emit('roleKill', {role:"You are a Victim"}); 
                }
            }

            //recipientSocket.emit('roleKill',{role:"You are a Killer"});
        }
         //socket.emit('roleKill', {role:"You are a Victim"});
        console.log(playerlist);
    });


    socket.on('room100',function(data){
        //checks if player is a victim
        if(playerlist[socket.username].type == "victim"){
            if (data.r == "room100"){
                if(room100 != "---"){
                    console.log("Someone is here");
                    socket.emit('roomFull', {floor:"floor1", status:"occupied"});
                }else{
                    console.log("UPDATED ROOM 100");
                    playerlist[socket.username].location = "room100";
                    room100 = socket.username;
                    console.log("room100:"+room100); 
                    socket.emit('room100Full', {floor:"floor1", status:"vacant"});
                }
                          
            }
        }else{
            console.log("THE KILLER IS CLICKING");
            //socket.emit('receiveRoomIdFromKiller',{r:"room100"});
            if(room100 != "---"){
                playerlist[room100].status = "dead";
                
                console.log('Player '+room100+' is dead');

                var recipientSocket= null;

                var aliveSocket= null;

                for(var i in SOCKET_LIST){
                    if(SOCKET_LIST[i].username === room100){
                        recipientSocket = SOCKET_LIST[i];
                    }else{
                        aliveSocket = SOCKET_LIST[i];
                    }
                }
               
                recipientSocket.emit('dead',{room:room100});
                numberOfPlayers--;
               


                if(numberOfPlayers >= 0 && killersTurn == 0){
                    //socket killer loses
                    socket.emit('killerLoses');
                    console.log("CURRENT NUMBER OF PLAYERS" + numberOfPlayers);
                    console.log("TURNS OF KILLER" + killersTurn);
                    aliveSocket.emit('victimWins');
                }
                if(numberOfPlayers == 0 && killersTurn == 1){
                    //socket killer wins
                    socket.emit('killerWins');
                    console.log("CURRENT NUMBER OF PLAYERS" + numberOfPlayers);
                    console.log("TURNS OF KILLER" + killersTurn);
                }

                killersTurn--;

            }else{
                killersTurn--;

                  console.log("CURRENT NUMBER OF PLAYERS" + numberOfPlayers);
                console.log("TURNS OF KILLER" + killersTurn);
                if(numberOfPlayers >= 1 && killersTurn == 0){
                    //socket killer loses
                    socket.emit('killerLoses');
                }
                if(numberOfPlayers == 0 && killersTurn == 1){
                    //socket killer wins
                    socket.emit('killerWins');
                }
            }
            
        }

        
        console.log("room100:"+room100);
        console.log("room101:"+room101);
        console.log("room102:"+room102);
        console.log("room103:"+room103);
        console.log("room104:"+room104);
    });

    socket.on('room101',function(data){

        if(playerlist[socket.username].type == "victim"){
            if (data.r == "room101"){
                if(room101 != "---"){
                    console.log("Someone is here");
                    socket.emit('roomFull', {floor:"floor1", status:"occupied"});
                }else{
                    console.log("UPDATED ROOM 101");
                    playerlist[socket.username].location = "room101";
                    room101 = socket.username;
                    console.log("room101:"+room101); 
                    socket.emit('room101Full', {floor:"floor1", status:"vacant"});
                }
                          
            }
        }else{
            console.log("THE KILLER IS CLICKING");
            if(room101 != "---"){
                playerlist[room101].status = "dead";
                
                console.log('Player '+room101+' is dead');

                var recipientSocket= null;

                var aliveSocket= null;

                for(var i in SOCKET_LIST){
                    if(SOCKET_LIST[i].username === room101){
                        recipientSocket = SOCKET_LIST[i];
                    }else{
                        aliveSocket = SOCKET_LIST[i];
                    }
                }
               
                recipientSocket.emit('dead',{room:room100});
                numberOfPlayers--;
               


                if(numberOfPlayers >= 0 && killersTurn == 0){
                    //socket killer loses
                    socket.emit('killerLoses');
                    console.log("CURRENT NUMBER OF PLAYERS" + numberOfPlayers);
                    console.log("TURNS OF KILLER" + killersTurn);
                    aliveSocket.emit('victimWins');
                }
                if(numberOfPlayers == 0 && killersTurn == 1){
                    //socket killer wins
                    socket.emit('killerWins');
                    console.log("CURRENT NUMBER OF PLAYERS" + numberOfPlayers);
                    console.log("TURNS OF KILLER" + killersTurn);
                }

                killersTurn--;

            }else{
                killersTurn--;

                  console.log("CURRENT NUMBER OF PLAYERS" + numberOfPlayers);
                console.log("TURNS OF KILLER" + killersTurn);
                if(numberOfPlayers >= 1 && killersTurn == 0){
                    //socket killer loses
                    socket.emit('killerLoses');
                }
                if(numberOfPlayers == 0 && killersTurn == 1){
                    //socket killer wins
                    socket.emit('killerWins');
                }
            }
            
        }
        
        console.log("room100:"+room100);
        console.log("room101:"+room101);
        console.log("room102:"+room102);
        console.log("room103:"+room103);
        console.log("room104:"+room104);
    });

    socket.on('room102',function(data){

        if(playerlist[socket.username].type == "victim"){
            if (data.r == "room102"){
                if(room102 != "---"){
                    console.log("Someone is here");
                    socket.emit('roomFull', {floor:"floor1", status:"occupied"});
                }else{
                    console.log("UPDATED ROOM 102");
                    playerlist[socket.username].location = "room102";
                    room102 = socket.username;
                    console.log("room102:"+room102); 
                    socket.emit('room102Full', {floor:"floor1", status:"vacant"});
                }
            }
        }else{
            console.log("THE KILLER IS CLICKING");
            if(room102 != "---"){
                playerlist[room102].status = "dead";
                
                console.log('Player '+room102+' is dead');

                var recipientSocket= null;

                var aliveSocket= null;

                for(var i in SOCKET_LIST){
                    if(SOCKET_LIST[i].username === room102){
                        recipientSocket = SOCKET_LIST[i];
                    }else{
                        aliveSocket = SOCKET_LIST[i];
                    }
                }
               
                recipientSocket.emit('dead',{room:room100});
                numberOfPlayers--;
               


                if(numberOfPlayers >= 0 && killersTurn == 0){
                    //socket killer loses
                    socket.emit('killerLoses');
                    console.log("CURRENT NUMBER OF PLAYERS" + numberOfPlayers);
                    console.log("TURNS OF KILLER" + killersTurn);
                    aliveSocket.emit('victimWins');
                }
                if(numberOfPlayers == 0 && killersTurn == 1){
                    //socket killer wins
                    socket.emit('killerWins');
                    console.log("CURRENT NUMBER OF PLAYERS" + numberOfPlayers);
                    console.log("TURNS OF KILLER" + killersTurn);
                }

                killersTurn--;

            }else{
                killersTurn--;

                  console.log("CURRENT NUMBER OF PLAYERS" + numberOfPlayers);
                console.log("TURNS OF KILLER" + killersTurn);
                if(numberOfPlayers >= 1 && killersTurn == 0){
                    //socket killer loses
                    socket.emit('killerLoses');
                }
                if(numberOfPlayers == 0 && killersTurn == 1){
                    //socket killer wins
                    socket.emit('killerWins');
                }
            }
            
        }
        
        console.log("GAME LOCATION");
        console.log("room100:"+room100);
        console.log("room101:"+room101);
        console.log("room102:"+room102);
        console.log("room103:"+room103);
        console.log("room104:"+room104);
        console.log("----END----");
    });

    socket.on('room103',function(data){

        if(playerlist[socket.username].type == "victim"){
            if (data.r == "room103"){
                if(room103!= "---"){
                    console.log("Someone is here");
                    socket.emit('roomFull', {floor:"floor1", status:"occupied"});
                }else{
                    console.log("UPDATED ROOM 103");
                    playerlist[socket.username].location = "room103";
                    room103 = socket.username;
                    console.log("room103:"+room103); 
                    socket.emit('room103Full', {floor:"floor1", status:"vacant"});
                }
                          
            }
        }else{
            console.log("THE KILLER IS CLICKING");
            if(room103 != "---"){
                playerlist[room103].status = "dead";
                
                console.log('Player '+room103+' is dead');

                var recipientSocket= null;

                var aliveSocket= null;

                for(var i in SOCKET_LIST){
                    if(SOCKET_LIST[i].username === room103){
                        recipientSocket = SOCKET_LIST[i];
                    }else{
                        aliveSocket = SOCKET_LIST[i];
                    }
                }
               
                recipientSocket.emit('dead',{room:room100});
                numberOfPlayers--;
               


                if(numberOfPlayers >= 0 && killersTurn == 0){
                    //socket killer loses
                    socket.emit('killerLoses');
                    console.log("CURRENT NUMBER OF PLAYERS" + numberOfPlayers);
                    console.log("TURNS OF KILLER" + killersTurn);
                    aliveSocket.emit('victimWins');
                }
                if(numberOfPlayers == 0 && killersTurn == 1){
                    //socket killer wins
                    socket.emit('killerWins');
                    console.log("CURRENT NUMBER OF PLAYERS" + numberOfPlayers);
                    console.log("TURNS OF KILLER" + killersTurn);
                }

                killersTurn--;

            }else{
                killersTurn--;

                  console.log("CURRENT NUMBER OF PLAYERS" + numberOfPlayers);
                console.log("TURNS OF KILLER" + killersTurn);
                if(numberOfPlayers >= 1 && killersTurn == 0){
                    //socket killer loses
                    socket.emit('killerLoses');
                }
                if(numberOfPlayers == 0 && killersTurn == 1){
                    //socket killer wins
                    socket.emit('killerWins');
                }
            }
            
        }
        
        console.log("GAME LOCATION");
        console.log("room100:"+room100);
        console.log("room101:"+room101);
        console.log("room102:"+room102);
        console.log("room103:"+room103);
        console.log("room104:"+room104);
        console.log("----END----");
    });



    socket.on('room104',function(data){

        if(playerlist[socket.username].type == "victim"){
            if (data.r == "room104"){
                if(room104 != "---"){
                    console.log("Someone is here");
                    socket.emit('roomFull', {floor:"floor1", status:"occupied"});
                }else{
                    console.log("UPDATED ROOM 104");
                    playerlist[socket.username].location = "room104";
                    room104 = socket.username;
                    console.log("room104:"+room104); 
                    socket.emit('room104Full', {floor:"floor1", status:"vacant"});
                }
                          
            }
        }else{
            console.log("THE KILLER IS CLICKING");
            if(room104 != "---"){
                playerlist[room104].status = "dead";
                
                console.log('Player '+room104+' is dead');

                var recipientSocket= null;
    var aliveSocket= null;

                for(var i in SOCKET_LIST){
                    if(SOCKET_LIST[i].username === room104){
                        recipientSocket = SOCKET_LIST[i];
                    }else{
                        aliveSocket = SOCKET_LIST[i];
                    }
                }
               
                recipientSocket.emit('dead',{room:room100});
                numberOfPlayers--;
               


                if(numberOfPlayers >= 0 && killersTurn == 0){
                    //socket killer loses
                    socket.emit('killerLoses');
                    console.log("CURRENT NUMBER OF PLAYERS" + numberOfPlayers);
                    console.log("TURNS OF KILLER" + killersTurn);
                    aliveSocket.emit('victimWins');
                }
                if(numberOfPlayers == 1 && killersTurn  == 0){
                    //socket killer wins
                    socket.emit('kilerWins');
                }

                killersTurn--;
                console.log("TURNS OF KILLER" + killersTurn);

            }else{
                killersTurn--;
                console.log("CURRENT NUMBER OF PLAYERS" + numberOfPlayers);
                console.log("TURNS OF KILLER" + killersTurn);
                if(numberOfPlayers >= 1 && killersTurn == 0){
                    //socket killer loses
                    socket.emit('killerLoses');
                }else if(numberOfPlayers == 0 && killersTurn >= 1){
                    //socket killer wins
                    socket.emit('kilerWins');
                }
            }
        }
        
        console.log("GAME LOCATION");
        console.log("room100:"+room100);
        console.log("room101:"+room101);
        console.log("room102:"+room102);
        console.log("room103:"+room103);
        console.log("room104:"+room104);
        console.log("----END----");
    });


    socket.on('room100Exit',function(data) {
        playerlist[socket.username].location = "floor1";
        room100 = "---";
    });

    socket.on('room101Exit',function(data) {
        playerlist[socket.username].location = "floor1";
        room101 = "---";
    });

    socket.on('room102Exit',function(data) {
        playerlist[socket.username].location = "floor1";
        room102 = "---";
    });

    socket.on('room103Exit',function(data) {
        playerlist[socket.username].location = "floor1";
        room103 = "---";
    });

    socket.on('room104Exit',function(data) {
        playerlist[socket.username].location = "floor1";
        room104 = "---";
    });
});






