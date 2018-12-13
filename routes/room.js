exports.roomRoute = function (app, db, bodyParser, public) {

    app.get('/create-room', (req, res) => {
        if (req.session.isLoggedIn == true) {
            var path = require('path');
            res.sendFile(path.resolve(__dirname + "/../public/create-room.html"));
        }
        else {
            var path = require('path')
            res.sendFile(path.resolve(__dirname + '/../public/login.html'));
    }
})

app.post('/create-room', (req, res) => {
        if (req.session.isLoggedIn == true) {
            var path = require('path')
            res.sendFile(path.resolve(__dirname + '/../public/chatroom.html'));
            console.log("Denne bruger inde på ", req.session.username);
        }
        else {
            var path = require('path')
            res.sendFile(path.resolve(__dirname + '/../public/login.html'));
        }
    })
}