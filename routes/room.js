exports.roomRoute = function (app, db, bodyParser, public) {

app.get('/create-room', (req, res) => {
    if(req.session.isLoggedIn === true) {

    var path = require('path');
    res.sendFile(path.resolve(__dirname + "/../public/create-room.html"));

    }
    else {
        var path = require('path')
            res.sendFile(path.resolve(__dirname + '/../public/login.html'));
    }
})

app.post('/create-room', (req, res) => {
    const name = req.body.roomName;

    if (name && req.session.isLoggedIn === true) {

        db.Room.query().select().where({ name: name }).then(roomArray => {
            if (roomArray.length > 0) {
                console.log("room name already exists")
                console.log("TEST ROOM ALREADY EXIST");
                
                res.send({ "status": 200, "response": "room name already exist" });
            } else {
                db.Room.query().insert({ name: name }).then(persistedData => {
                    console.log("everything went well" + "ROOM CREATED");
                    console.log(persistedData);
                    res.send({ "status": 200, "response": "everything went well" });
                })

            }
        })
    }
    else {
            var path = require('path')
            res.sendFile(path.resolve(__dirname + '/../public/login.html'));
        }
    })
 }