exports.userRoute = function (app, db, bodyParser, public) {

    // app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}));

    const bcrypt = require('bcrypt');
    const saltRounds = 10;

    app.get("/signup",(req, res) => {
        var path = require('path');
        res.sendFile(path.resolve(__dirname + '/../public/signup.html'));
    });

    app.post('/signup', (req, res) => {
        const username = req.body.username;
        const password = req.body.password;

        if (username && password) {
            // SELECT * FROM users WHERE username = '?' 
            db.User.query().select().where({ username }).then(userArray => {
                if (userArray.length > 0) {
                    console.log("username already exist")
                    res.send({ "status": 200, "response": "username already exist" });
                }
                else {
                    bcrypt.hash(password, saltRounds).then(function(hash) {
                        // INSERT INTO users('user', 'password') VALUES('?', '?');
                        db.User.query().insert({ username, password: hash }).then(persistedData => {
                            req.session.isLoggedIn = true;
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
        if (req.session.isLoggedIn == true)
        {
            var path = require('path')
            res.sendFile(path.resolve(__dirname + '/../public/chatroom.html'));
            console.log("Denne bruger inde på ", req.session.username);
        }
        else {
            var path = require('path')
            res.sendFile(path.resolve(__dirname + '/../public/login.html'));
        }
    })

    app.post('/login', (req, res) => {
        const username = req.body.username;
        const password = req.body.password;

        db.User.query().select().where({ username }).then(userArray => {
            if (userArray.length > 0) {
                bcrypt.compare(password, userArray[0].password).then(response => {
                    if (response) {
                        req.session.isLoggedIn = true;
                        req.session.username = req.body.username;
                        req.session.id = userArray[0].id;
                        res.redirect('/chatroom');
                    }
                    else {
                        res.send({ "status": 403, "response": "unauthorized" })
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

    app.get('/logout', (req, res) => {
        req.session.destroy();
        res.redirect('/');
    })
}