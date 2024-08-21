const mysql = require('mysql2')
require('dotenv').config()

dbInfo = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
}

module.exports = {
    init: function() {
        return mysql.createConnection(dbInfo)
    },
    connect: function(conn) {
        conn.connect((err)=>{
            if(err) console.log('MySQL 연결 실패')
            else    console.log('MySQL 연결 성공')
        })
    }
}