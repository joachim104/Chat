// require the libraries
// når vi siger require henter vi i dette eksempel express 
var express = require("express");
var app = express();

const Knex = require("knex"); // her henter vi knex. 
const Model = require("objection").Model;
const knexConfig = require('./knexfile').development;
<<<<<<< HEAD
=======
// body-parser giver adgang til req.body
>>>>>>> 6888eb111e874c52bf8c399a9b31c80df5f32333
const bodyParser = require("body-parser");

// server opsætning
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

// use the driver and connect locally to my mysql
const knex = require('knex')(knexConfig);

const public = app.use(express.static('public'));


const session = require('express-session');
<<<<<<< HEAD
=======

>>>>>>> 6888eb111e874c52bf8c399a9b31c80df5f32333
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
<<<<<<< HEAD
    cookie: { secure: true }
=======
    cookie: { secure: true } // hvis sættes til false behøver vi ikke https
>>>>>>> 6888eb111e874c52bf8c399a9b31c80df5f32333
}));

// connect knex with objection and put query methods on the models
Model.knex(knex);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

io.on('connect', socket => {
    socket.on('send-message', function(data) {
<<<<<<< HEAD
        // emits to all the sockets
        console.log("socket bliver ramt")
        const socketId = socket.id;
        // io.emit("here's the message", data, socketId);
        socket.broadcast.emit("here's the message", data);




        // io.sockets.socket(data.clientid).emit("here's the message", {
        //     message: data.message,
        //     senderid: socket.id
        // });

        // emits only to the specific socket
        // socket.emit("here's the color", data);
        
        // emits to all but the socket itself
        // socket.broadcast.emit("here's the color", data);
    })
})

// app.listen(3000, function (err) {
//     if (err) {
//         console.log("Server is dead")

//     }
//     else {
//         console.log("Server is alive")
//     }
// })

=======
        // emits to all but the socket itself
        socket.broadcast.emit("here's the message", data);

        // emits to all the sockets
        // io.emit("here's the message", data);


        // emits only to the specific socket
        // socket.emit("here's the message", data);
    
    })
})

>>>>>>> 6888eb111e874c52bf8c399a9b31c80df5f32333
server.listen(3000, (err) => {
    if (err) throw err;
    console.log("Server is running on port 3000");
})

<<<<<<< HEAD

=======
>>>>>>> 6888eb111e874c52bf8c399a9b31c80df5f32333
// convenience object.. easy access to the models
const db = {
    "knex": knex,
    "User": require("./models/User"),
    "Message": require("./models/Message"),
    "Room": require("./models/Room")
};

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


// her wrapper vi hele filen i userRoutes
const userRoutes = require('./routes/user');
userRoutes.userRoute(app, db, bodyParser, public);
