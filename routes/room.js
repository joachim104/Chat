exports.roomRoute = function (app, db, bodyParser, public) {

    app.get('/create-room', (req, res) => {
        if (req.session.isLoggedIn == true) {
            console.log(req.session.username)
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
            res.sendFile(path.resolve(__dirname + '/../public/create-room.html'));
        }
        else {
            var path = require('path')
            res.sendFile(path.resolve(__dirname + '/../public/login.html'));
        }
    })
}