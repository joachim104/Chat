exports.userRoute = function (app, db, bodyParser, public) {


    const bcrypt = require('bcrypt');
    const saltRounds = 10;

    const userArray = [];

    app.get("/signup", (req, res) => {
        var path = require('path');
        res.sendFile(path.resolve(__dirname + '/../public/signup.html'));
    });

    app.post('/signup', (req, res) => {
        const username = req.body.username;
        const password = req.body.password;

        if (username && password) {
            // SELECT * FROM users WHERE username = '?' 
            db.User.query().select().where({ username: username }).then(userArray => {
                if (userArray.length > 0) {
                    console.log("username already exist")
                    res.send({ "status": 200, "response": "username already exist" });
                }
                else {
                    bcrypt.hash(password, saltRounds).then(function (hash) {
                        // INSERT INTO users('user', 'password') VALUES('?', '?');
                        db.User.query().insert({ username, password: hash }).then(persistedData => {
                            // res.send({ "status": 200, "response": "everything went well" });
                            res.redirect('/login');
                        });
                    });
                }
            })
        }
        else {
            res.send("password or username is empty")
        }
    });

    app.get('/login', (req, res) => {
        var path = require('path')
        res.sendFile(path.resolve(__dirname + '/../public/login.html'));
    })

    app.post('/login', (req, res) => {
        const username = req.body.username;
        const password = req.body.password;

        db.User.query().select().where({ username }).then(userArray => {
            if (userArray.length > 0) {
                bcrypt.compare(password, userArray[0].password).then(response => {
                    if (response) {
                        var path = require("path");
                        req.session.isLoggedIn = true;
                        req.session.username = req.body.username;
                        req.session.userid = userArray[0].id;
                        res.sendFile(path.resolve(__dirname + '/../public/user-page.html'));
                    }
                })
            }
            else {
                console.log("login failed 2")
                var path = require('path')
                res.sendFile(path.resolve(__dirname + '/../public/login.html'));
            }
        })
    });

    app.get('/user-page', (req, res) => {
        if (req.session.isLoggedIn == true) {
            var path = require('path')
            res.sendFile(path.resolve(__dirname + '/../public/user-page.html'));
        } else {
            var path = require('path')
            res.sendFile(path.resolve(__dirname + '/../public/login.html'));
        }
    })

    // express dynamic url param
    app.get('/chatroom', (req, res) => {

        const roomName = "admin-user-";
        console.log("DEN RAMMER INDE I CHATROOM!");

        // && roomName.indexOf(req.session.username)

        if (req.session.isLoggedIn == true) {
            // når vi har roomname så hent alle beskeder i db der matcher det roomname 
            // og sender beskederne videre med
            console.log(req.params.roomName);
            var path = require('path')
            res.sendFile(path.resolve(__dirname + '/../public/chatroom.html'));
        }
        else {
            var path = require('path')
            res.sendFile(path.resolve(__dirname + '/../public/login.html'));
        }
    })

    app.get('/logout', (req, res) => {
        req.session.destroy();
        res.redirect('/index.html');
    })

    app.get('/addfriend', (req, res) => {

        if (req.session.isLoggedIn == true) {
            var path = require('path')
            res.sendFile(path.resolve(__dirname + "/../public/addfriend.html"))
        } else {
            var path = require('path')
            res.sendFile(path.resolve(__dirname + '/../public/login.html'));
        }

    })
}