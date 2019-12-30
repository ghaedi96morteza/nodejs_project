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
app.use(bodyparser.urlencoded({ extended: true }));
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
let sql_query_select = "call SelectFromUsers (?)";
let sql_query_insert = 'call InsertIntoUsers (?,?,?,?)';

app.post('/login', async(request, response) => {
    let login_username = request.body.login_username;
    let login_password = request.body.login_password;
    const db = new DataBase(config);
    let sql_query = 'select * from users where username = ?';
    let login = await db.query(sql_query_select, [login_username]);
    if (login[0].length > 0) {
        const match = await bcrypt.compare(login_password, login[0][0].password);
        if (match) {
            request.session.userrole = login[0][0].role;
            request.session.loggedin = true;
            request.session.name = login[0][0].fullname;
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

app.post('/signup', async(request, response) => {
    let signup_fullname = request.body.signup_fullname;
    let signup_username = request.body.signup_username;
    let signup_password = request.body.signup_password;
    let signup_cpassword = request.body.signup_cpassword;
    let signup_userrole = request.body.userstype;
    const db = new DataBase(config);
    if (signup_password == signup_cpassword) {
        let result = await db.query(sql_query_select, [signup_username]);
        if (result[0].length > 0) {
            response.send("نام کاربری تکراری است");
        } else {
            bcrypt.genSalt(10, async(err, salt) => {
                bcrypt.hash(signup_password, salt, async(err, hash) => {
                    await db.query(sql_query_insert, [signup_username, hash, signup_fullname, signup_userrole]);

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
            name: req.session.name,
            role: req.session.userrole
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

app.get('/post', (req, res) => {
    res.render('post.html', {
        title: 'صفحه ثبت پست'
    });

});

app.get('/comments', (req, res) => {
    res.render('comments.html', {
        title: 'صفحه ثبت نظر'
    });

});
app.listen(880);