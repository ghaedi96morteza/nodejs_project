const mysql = require('mysql');
module.exports = class DataBase {
    constructor(config) {
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