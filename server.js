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

let sql_query_select_users = "call select_from_users (?)";
let sql_query_insert_users = "call insert_into_users (?,?,?,?)";
let sql_query_insert_posts =  "call insert_into_posts (?,?,?,?,?)";
let sql_query_insert_comments = "call insert_into_comments (?,?,?,?)";
// ----------------  method post ------------------------------------------------------------

app.post('/login', async (request, response) => {
    let login_username = request.body.login_username;
    let login_password = request.body.login_password;
    const db = new DataBase();
    let login = await db.query(sql_query_select_users, [login_username]);
    if (login[0].length > 0) {
        const match = await bcrypt.compare(login_password, login[0][0].password);
        if (match) {
            request.session.userrole = login[0][0].role;
            request.session.loggedin = true;
            request.session.name = login[0][0].fullname;
            request.session.username = login[0][0].username;
            request.session.userid = login[0][0].id;
            if (login[0][0].role == "استاد") {
                response.redirect('/inst_page');
            } else if (login[0][0].role == "دانشجو") {
                response.redirect('/');
            }

        } else {
            response.send("نام کاربری و (یا) رمز شما اشتباه است.");
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
    const db = new DataBase();
    if (signup_password == signup_cpassword) {
        let result = await db.query(sql_query_select_users, [signup_username]);
        if (result[0].length > 0) {
            response.send("نام کاربری تکراری است");
        }
        else {
            bcrypt.genSalt(10, async(err, salt) => {
                bcrypt.hash(signup_password, salt, async(err, hash) => {
                    let arg = [signup_username, hash, signup_fullname, signup_userrole]
                    await db.query(sql_query_insert_users, arg);
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
    let post_title = request.body.post_title;
    let post_author = request.session.name;
    let post_file_dir;
    const db = new DataBase();
    await fs.mkdir('public/files/'+request.session.username,(err)=>{
        if (err){
            console.log(err);
        }
    });
    await post_file.mv('public/files/'+request.session.username+'/'+post_file.name, async (err)=> {
        if (err) {
            console.log(err);
            post_file_dir = '';
        }
        else {
            post_file_dir = 'files/' + request.session.username + '/' + post_file.name;
        }
        let arg = [request.session.userid,post_body,post_file_dir,post_title,post_author];
        await db.query(sql_query_insert_posts,arg);
        response.send('مطلب و مسیر فایل به پایگاه داده اضافه شدند.');
        await db.close();
        response.end();
    });

});
app.post("/comment", async (request,response)=>{
    let comment_body = request.body.comment_body;
    let comment_pid = request.session.pid;
    let comment_author = request.session.name;
    const db = new DataBase();
    let arg= [comment_body,comment_pid,request.session.userid,comment_author];
    await db.query(sql_query_insert_comments,arg);
    response.send('نظر شما دریافت شد.')
    response.end();
});
// -------------------------------------------------------------------------------------

// ------------- renders --------------------------------------------------------------
app.get('/', (req, res) => {
    res.redirect('/home');
});
// home page *******************************


app.get('/home', async (req, res) => {
    const db = new DataBase();
    let posts = await db.query("select * from posts order by id desc limit 3");
    let title =[];
    let body = [];
    let dir =[];
    let pid=[];
    let author=[];
    if(posts.length>0){
        for(let i = 0 ; i< posts.length;i++){
            title[i] = posts[i].title;
            body[i] = posts[i].body;
            dir[i] = posts[i].file_dir;
            pid[i] = posts[i].id;
            author[i] = posts[i].author;
        }
        res.render('home_page.html', {
            title: 'صفحه اصلی',
            title01 :  title[0],
            body01: body[0],
            dir01 : dir[0],
            author01:author[0],
            id01 : pid[0],
            title02 : title[1],
            body02: body[1],
            dir02 : dir[1],
            author02:author[1],
            id02 : pid[1],
            title03 : title[2],
            body03: body[2],
            dir03 : dir[2],
            author03:author[2],
            id03 : pid[2],
        });
    }
});
app.get("/show_comments",async (request,response)=>{
    let url = request.url;
    let pid = url.split("?")[1];
    const db = new DataBase();
    let comments = await db.query("select * from comments where postid =? order by id desc limit 3 ",
        [pid]);
    let author =[];
    let body=[];
    if(comments.length>0){
        for (let i = 0;i<comments.length;i++){
            author[i] = comments[i].author;
            body[i] = comments[i].body;
        }
        response.render("show_comments.html",{
            title: 'صفحه نظرات',
            author01 : author[0],
            body01 : body[0],
            author02 : author[1],
            body02 : body[1],
            author03 : author[2],
            body03 : body[2],
        });
    }
    else{
        response.render("show_comments.html", {
            title: 'صفحه نظرات',
        });
    }
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

app.get('/comment_page', (req, res) => {
    if(req.session.loggedin == true){
        let url = req.url;
        let pid = url.split("?")[1];
        req.session.pid = pid;
        res.render('comment_page.html', {
            title: 'صفحه ثبت نظر',
            name : req.session.name
        });
    }
    else {
        res.redirect('/login');
    }
});
// --------------------------------------------------------------------------
app.listen(8000);