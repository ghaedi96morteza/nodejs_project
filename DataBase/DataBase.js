const mysql = require('mysql');

const config = {
    host: 'localhost',
    user: 'root',
    password: 'mysql',
    database: 'nodejs_project'
};
module.exports = class DataBase {
    constructor() {
        this.connection = mysql.createConnection(config);
    }
    query (sql,args){
        return new Promise((resolve,reject)=>{
            this.connection.query(sql,args,(err,results)=>{
                if (err) {reject(err);}
                else {resolve(results);}
            });
        });
    }
    close(){
        return new Promise((resolve,reject)=>{
            this.connection.end((err)=>{
                if (err) {reject(err);}
                else {resolve();}
            });
        });
    }

};