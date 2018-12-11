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

io.on('connect', socket => {
    socket.on('send-message', function(data) {

        // emits to all but the socket itself // denne her skal vi bruge i et rum med flere brugere
        socket.broadcast.emit("here's the message", data);
        
        let message = data.message;

        console.log(socket.handshake.session.username, "har skrevet: ", message);
        var userInfo = socket.handshake.session.userid;
        
        db.Message.query().insert({ message: message, user_id: userInfo }).then(console.log(message)
        );;
        
        // emits to all the sockets
        // io.emit("here's the message", data);


        // emits only to the specific socket // denne her skal bruges i privat chat med 2 brugere
        // socket.emit("here's the message", data);
    
    })
})

io.on('connection', function(socket){
    socket.on('addAllUsers', function(){
        
        db.User.query().select('id', 'username').from('users').then(userArray => {
            //console.log(userArray[0].username);

        socket.emit('hereIsTheUserList', userArray);
        })

    socket.on('addUser', function(data){
    db.User.query().select().from('users').where({username: data}).then(userArray =>{
        //console.log(userArray); <------- printer alt info om den bruger den har fundet, som du har selected, ud

        console.log("user id: ", userArray[0].id);
    })
    
    })

    })

    socket.on('addAsFriend', function(data){
       // console.log("here is user you clicked", data);
        db.User.query().select().from('users').where({username: data}).then(userArray =>{

            console.log("user u clicked on: ", userArray);
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
    "Room": require("./models/Room")
};

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// her wrapper vi hele filen i userRoutes
const userRoutes = require('./routes/user');
const roomRoutes = require('./routes/room');
roomRoutes.roomRoute(app,db,bodyParser, public);
userRoutes.userRoute(app, db, bodyParser, public);