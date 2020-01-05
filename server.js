const express = require('express');
const app = express();
const hbs = require('hbs');
const bodyparser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const DataBase = require('./DataBase/DataBase');
const fileupload = require('express-fileupload');
const fs = require('fs');

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
app.use(fileupload());

const config = {
    host: 'localhost',
    user: 'root',
    password: 'mysql',
    database: 'nodejs_project'
};
let sql_query_select_users = "call select_from_users (?)";
let sql_query_insert_users = "call insert_into_users (?,?,?,?)";
let sql_query_insert_posts =  "call insert_into_posts (?,?,?)";
// ----------------  method post ------------------------------------------------------------

app.post('/login', async(request, response) => {
    let login_username = request.body.login_username;
    let login_password = request.body.login_password;
    const db = new DataBase(config);
    let login = await db.query(sql_query_select_users, [login_username]);
    if (login[0].length > 0) {
        const match = await bcrypt.compare(login_password, login[0][0].password);
        if (match) {
            request.session.userrole = login[0][0].role;
            request.session.loggedin = true;
            request.session.name = login[0][0].fullname;
            request.session.username = login[0][0].username;
            request.session.userid = login[0][0].id;
            if(login[0][0].role=="استاد"){
                response.redirect('/inst_page');
            }
            else if (login[0][0].role=="دانشجو"){
                response.redirect('/');
            }

        } else {
            response.send ("نام کاربری و (یا) رمز شما اشتباه است.");
            response.end();
        }
    } else {
        response.send("نام کاربری وجود ندارد.");
        response.end();
    }
    await db.close();
    response.end();
});

app.post('/sign_up', async(request, response) => {
    let signup_fullname = request.body.signup_fullname;
    let signup_username = request.body.signup_username;
    let signup_password = request.body.signup_password;
    let signup_cpassword = request.body.signup_cpassword;
    let signup_userrole = request.body.user_type;
    const db = new DataBase(config);
    if (signup_password == signup_cpassword) {
        let result = await db.query(sql_query_select_users, [signup_username]);
        if (result[0].length > 0) {
            response.send("نام کاربری تکراری است");
        }
        else {
            bcrypt.genSalt(10, async(err, salt) => {
                bcrypt.hash(signup_password, salt, async(err, hash) => {
                    await db.query(sql_query_insert_users, [signup_username, hash, signup_fullname, signup_userrole]);
                    await db.close();
                });
            });
            response.send("عملیات ثبت نام با موفقیت انجام شد.");
        }
    }
    else {
        response.send("رمز و تأیید رمز همسان نیستند");
        response.end();
    }
    response.end();
});
app.post('/post', async (request, response)=>{
    let post_body = request.body.post_body;
    let post_file = request.files.post_file;
    let post_file_dir = '';
    const db = new DataBase(config);
    await fs.mkdir('files/'+request.session.username,(err)=>{
        if (err){
            console.log(err);
        }
    });
    post_file.mv('files/'+request.session.username+'/'+post_file.name, async (err)=>{
        if (err){
            console.log(err);
        }
        else{
            post_file_dir = 'files/'+request.session.username+'/'+post_file.name;
        }
        await db.query(sql_query_insert_posts,[request.session.userid,post_body,post_file_dir]);
        response.send('مطلب و مسیر فایل به پایگاه داده اضافه شدند.');
        await db.close();
        response.end();
    });
});
// -------------------------------------------------------------------------------------

// ------------- renders --------------------------------------------------------------
app.get('/', (req, res) => {
    res.redirect('/home');
});
// home page *******************************
app.get('/home', (req, res) => {
        res.render('home_page.html', {
            title: 'صفحه اصلی',
        });
});
//-----------------------------------------

// login page *******************************
app.get('/login', (req, res) => {
    res.render('login_page.html', {
        title: 'صفحه ورود',
        alert : req.session.alert,
    });
});
//--------------------------------

// signup page *******************************
app.get('/sign_up', (req, res) => {
    res.render('sign_up_page.html', {
        title: 'صفحه ثبت نام'

    });
});
//-----------------------------------------

app.get('/inst_page', (req, res) => {
    if(req.session.loggedin == true && req.session.userrole == 'استاد'){
        res.render('inst_page.html', {
            title: 'صفحه ثبت پست',
            name : req.session.name
        });
    }
    else {
        res.redirect('/login');
    }
});
// --------------------------------------------------------------------------
app.listen(8000);