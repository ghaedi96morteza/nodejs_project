const express = require('express');
const app = express();
const hbs = require('hbs');
const bodyparser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const DataBase = require('./DataBase/DataBase');

app.set('view engine', 'hbs');
app.engine('html', require('hbs').__express);
app.use(express.static('public'));
hbs.registerPartials('views/partial');
app.use(bodyparser.urlencoded({extended: true}));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

const config = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs_project'
};

app.post('/login', async (request, response) => {
    let login_username = request.body.login_username;
    let login_password = request.body.login_password;
    const db = new DataBase(config);
    let sql_query = 'call selectfromusers (?)';
    let login = await db.query(sql_query, [login_username]);
    console.log(login[0].length);
    console.log(login[0]);
    if (login[0].length > 0) {
        const match = await bcrypt.compare(login_password, login[0].password);
        if (match) {
            request.session.loggedin = true;
            request.session.username = login_username;
            response.redirect('/home');
        } else {
            response.send("نام کاربری و (یا) رمز شما اشتباه است.");
            response.end();
        }
    } else {
        response.send("نام کاربری وجود ندارد.");
        response.end();
    }
    db.close();
    response.end();
});

app.post('/signup', async (request, response) => {
    let signup_username = request.body.signup_username;
    let signup_password = request.body.signup_password;
    let signup_cpassword = request.body.signup_cpassword;

    const db = new DataBase(config);
    let sql_query = 'call InsertIntoUsers (?,?)';

    if (signup_password == signup_cpassword) {
        let result = await db.query('SELECT username FROM users WHERE username=?', [signup_username]);
        if (result.length > 0) {
            response.send("نام کاربری تکراری است");
        } else {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(signup_password, salt, (err, hash) => {
                    db.query(sql_query, [signup_username, hash]);
                    console.log(hash);
                });
            });
            response.send('عملیات ثبت نام با موفقیت انجام شد.');
        }
    } else {
        response.send("رمز و تأیید رمز همسان نیستند");
        response.end();
    }
    response.end();
});


app.get('/', (req, res) => {
    res.redirect('/home');
});

app.get('/home', (req, res) => {

    if (req.session.loggedin == true) {
        res.render('home_page.html', {
            title: 'صفحه اصلی',
            content: req.session.username,
        });

    } else {
        res.redirect('/login');
    }
});
app.get('/login', (req, res) => {
    res.render('login_page.html', {
        title: 'صفحه ورود'
    });

});
app.get('/signup', (req, res) => {
    res.render('signup_page.html', {
        title: 'صفحه ثبت نام'
    });

});
app.listen(880);