// require the libraries
// når vi siger require henter vi i dette eksempel express 
var express = require("express");
var app = express();

const Knex = require("knex"); // her henter vi knex. 
const Model = require("objection").Model;
const knexConfig = require('./knexfile').development;
const session = require('express-session');
// body-parser giver adgang til req.body
const bodyParser = require("body-parser");

// server opsætning
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

const sharedsession = require("socket.io-express-session");

// use the driver and connect locally to my mysql
const knex = require('knex')(knexConfig);

const public = app.use(express.static('public'));

var appSession = session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // hvis sættes til false behøver vi ikke https
})

app.use(appSession)

io.use(sharedsession(appSession))

// connect knex with objection and put query methods on the models
Model.knex(knex);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// -----------------------------------------------------------------------------------
io.on('connection', function (socket) {

    const activeChatroomsArray = [];

    db.User.query().select('room_name_id').from('rooms').then(roomArray => {
        roomArray.forEach(roomName => {
            let stringRoom = JSON.stringify(roomName);
            if (stringRoom.includes(socket.handshake.session.username + "-")) {
                socket.join(stringRoom);
                activeChatroomsArray.push(stringRoom);
                console.log("det her er room: ", stringRoom)
            }
        });
        socket.emit('users-chatroom-list', activeChatroomsArray);
    });

    // io.to(stringRoom).emit('room message', { "navn": "lars" });

    socket.on('send-message', function (data) {
        // emits to all but the socket itself // denne her skal vi bruge i et rum med flere brugere
        socket.broadcast.emit("here's the message", data);

        let message = data.message;
        var userInfo = socket.handshake.session.userid;

        console.log(socket.handshake.session.username, "har skrevet: ", message);


        // OBS. her skal userinfo og room id gøres dynamisk istedet!!
        db.Message.query().insert({ message: message, user_id: userInfo, room_id: 18 }).then(console.log("")
        );
        // emits to all the sockets
        // io.emit("here's the message", data);


        // emits only to the specific socket // denne her skal bruges i privat chat med 2 brugere
        // socket.emit("here's the message", data);

    })
})

io.on('connection', function (socket) {
    addedUsers = [];
    roomNameString = "";
    allRoomNamesFromDB = [];
    roomNamesFoundWithMembership = [];
    roomIDsFoundWithMembership = [];

    socket.on('addAllUsers', function () {

        db.User.query().select('id', 'username').from('users').then(userArray => {
            //console.log(userArray[0].username);
            socket.emit('hereIsTheUserList', userArray);
        })

        socket.on('addUser', function (data) {
            db.User.query().select().from('users').where({ username: data }).then(userArray => {
                //console.log(userArray); <------- printer alt info om den bruger den har fundet, som du har selected, ud
                addedUsers.push(userArray[0].username);
            })
        })
    })

    socket.on('user-page-loaded', function () {
        currentUser = socket.handshake.session.username;
        db.Room.query().select('name', 'room_name_id').from('rooms').then(allRoomNames => {
            allRoomNamesFromDB = allRoomNames;

            for (i = 0; i < allRoomNamesFromDB.length; i++) {

                if (allRoomNamesFromDB[i].room_name_id.includes(currentUser)) {

                    console.log("match fundet: ", allRoomNamesFromDB[i].room_name_id, " ", currentUser)
                    roomNamesFoundWithMembership.push(allRoomNamesFromDB[i].name);
                    roomIDsFoundWithMembership.push(allRoomNamesFromDB[i].room_name_id);
                }
            }
            socket.emit('rooms-found-with-membership', roomNamesFoundWithMembership, roomIDsFoundWithMembership);
        })
    })

    socket.on('createRoom', function (roomName) {
        console.log("roomname is: ", roomName, "added users is: ", addedUsers)
        addedUsers.push(socket.handshake.session.username)

        let roomNameString = ""

        db.Room.query().select().where({ name: roomName }).then(userArray => {
            if (userArray.length > 0) {
                console.log("here is userarray: ", userArray);
                console.log("room name already exists")
                socket.emit("roomExists");

            } else {

                if (addedUsers.indexOf(socket.handshake.session.username) > -1) {
                    addedUsers.splice(socket.handshake.session.username, 1)
                }

                addedUsers.forEach(element => {
                    roomNameString = roomNameString + element + "-"
                });

                db.Room.query().insert({ name: roomName, room_name_id: roomNameString }).then()
                socket.emit("roomCreatedSucess");

            }
        })
    })

    socket.on('addAsFriend', function (data) {
        // console.log("here is user you clicked", data);
        db.User.query().select().from('users').where({ username: data }).then(userArray => {

            console.log("user u clicked on: ", userArray);

            let userId = parseInt(socket.handshake.session.userid, 10)

            console.log("DET HER ER ID USER :: ", socket.handshake.session.userid);

            console.log(userId);

            if (!isNaN(userId)) {
                console.log(userId);
                db.FriendList.query().insert({ user_id: userId, friend_id: userArray[0].id }).then(console.log(""))
            }

        })
    })
})

server.listen(3000, (err) => {
    if (err) throw err;
    console.log("Server is running on port 3000");
})

// convenience object.. easy access to the models
const db = {
    "knex": knex,
    "User": require("./models/User"),
    "Message": require("./models/Message"),
    "Room": require("./models/Room"),
    "FriendList": require("./models/FriendList")
};

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// her wrapper vi hele filen i userRoutes
const userRoutes = require('./routes/user');
const roomRoutes = require('./routes/room');
roomRoutes.roomRoute(app, db, bodyParser, public);
userRoutes.userRoute(app, db, bodyParser, public);