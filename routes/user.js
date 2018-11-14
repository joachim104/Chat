exports.userRoute = function (app, db, bodyParser, public) {

    const bcrypt = require('bcrypt');
    const saltRounds = 10;

    app.get("/signup", function (req, res) {
        var path = require('path');
        res.sendFile(path.resolve(__dirname + '/../public/signup.html'));
    });

    app.post('/signup', (req, res) => {
        const username = req.body.username;
        const password = req.body.password;

        console.log("signup post bliver ramt");

        if (username && password) {
            // SELECT * FROM users WHERE username = '?' 
            db.User.query().select().where({ username }).then(userArray => {
                if (userArray.length > 0) {
                    console.log("username already exist")
                    res.send({ "status": 200, "response": "username already exist" });
                }
                else {
                    bcrypt.hash(password, saltRounds).then(function (hash) {
                        // INSERT INTO users('user', 'password') VALUES('?', '?');
                        db.User.query().insert({ username, password: hash }).then(persistedData => {
                            // console.log("data", persistedData)
                            req.session.isLoggedIn = true;
                            console.log("everything went well");
                            res.send({ "status": 200, "response": "everything went well" });
                        });
                    });
                }
            })
        }
        else {
            res.send("password or username is empty")
        }
    });

    // __dirname er mappen som user.js ligger i
    app.get('/login', (req, res) => {
        var path = require('path')
        res.sendFile(path.resolve(__dirname + '/../public/login.html'));
    })

    app.get('/chatroom', (req, res) => {
        var path = require('path')
        res.sendFile(path.resolve(__dirname + '/../public/chatroom.html'));
    })

    app.post('/login', (req, res) => {
        const username = req.body.username;
        const password = req.body.password;

        db.User.query().select().where({ username }).then(userArray => {
            if (userArray.length > 0) {
                bcrypt.compare(password, userArray[0].password).then(response => {
                    if (response) {
                        req.session.isLoggedIn = true;
                        console.log("login succes")
                        res.redirect('/chatroom');
                    }
                    else {
                        console.log("login failed 1")
                        res.send({ "status": 403, "response": "unauthorized" })
                    }
                })
            }
            else {
                console.log("login failed 2")
                res.send({ "status": 403, "response": "unauthorized" })
            }
        })
    });

    app.get('/logout', (req, res) => {
        req.session.destroy();
        res.redirect('/');
    })
}