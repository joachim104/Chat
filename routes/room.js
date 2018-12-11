exports.roomRoute = function (app, db, bodyParser, public) {

app.get('/create-room', (req, res) => {

    var path = require('path');
    res.sendFile(path.resolve(__dirname + "/../public/create-room.html"));
})

app.post('/create-room', (req, res) => {
    const name = req.body.roomName;

    if (name) {

        db.Room.query().select().where({ name }).then(userArray => {
            if (userArray.length > 0) {
                console.log("room name already exists")
                res.send({ "status": 200, "response": "room name already exist" });
            } else {
                db.Room.query().insert({ name }).then(persistedData => {
                    console.log("everything went well");
                    res.send({ "status": 200, "response": "everything went well" });
                })

            }
        })
    }
    else {
        //res.send("Enter a room name!");
        if (req.session.isLoggedIn == true) {
            var path = require('path')
            res.sendFile(path.resolve(__dirname + '/../public/chatroom.html'));
            console.log("Denne bruger inde på ", req.session.username);
        }
        else {
            var path = require('path')
            res.sendFile(path.resolve(__dirname + '/../public/login.html'));
        }
    }
    })
 }