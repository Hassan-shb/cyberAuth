const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const collection = require('./config');
const { userInfo } = require('os');
const session = require('express-session');


const app = express();

app.use(session({
    secret: 'cn!ViM3UyyU3MiV!nc', // replace with a real secret key
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // set to true if using https
}));



app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.get('/', (req, res) => {
    res.render("login");
});

app.get('/signup', (req, res) => {
    res.render("signup");
});

app.post('/signup', async (req, res) => {
    const data = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    };
    
    const existingUser = await collection.findOne({ email: data.email });
    if (existingUser) {
        res.send("User with this email already exists!");
    } else {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        data.password = hashedPassword; // Save the hashed password
        const userData = await collection.insertMany(data);
        res.render("login");
    }
});


app.get('/login', (req, res) => {
    res.render("login");
});

app.post('/login', async (req, res) => {
    try {
        const check = await collection.findOne({ email: req.body.email });
        if (!check) {
            res.send('No email found');
            return;
        }
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (isPasswordMatch) {
            // Create session here
            req.session.user = check;
            res.redirect('/index');
        } else {
            res.send("Wrong Password");
        }
    } catch {
        res.send("Wrong Details");
    }
});


function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect('/login');
}


app.get('/index', isAuthenticated, (req, res) => {
    // Only authenticated users can view this
    res.render('index');
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/home');
        }
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
});









app.listen(8080,() => {
    console.log('Sever is listening on port 8080');
});