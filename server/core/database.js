/*
    DATABASE CONFIGURATION: 
    https://blog.logrocket.com/build-rest-api-node-express-mysql/
    https://codeburst.io/node-js-mysql-and-async-await-6fb25b01b628
*/

const conf = require('./config.js')
const mysql = require('mysql')
const {Client} = require('pg')

const mysqlConnection = mysql.createConnection(conf.mysqlDatabase)

const postgresConnection = new Client(conf.postgresDatabase)
postgresConnection.connect()

// callback here is meant for Enabling Profiler
function mysqlQuery(sql, values = [], callback = () => { return false }) {
    return new Promise((resolve, reject) => {
        if(values.length > 0) {
            mysqlConnection.query(sql, values, function(err, rows){
                if(callback() !== false) callback(sql)
                if(err) reject(err)
                resolve(rows)
            })
        } else {
            mysqlConnection.query(sql, function(err, rows){
                if(callback() !== false) callback(sql)
                if(err) reject(err)
                resolve(rows)
            })
        }
    })
}

function postgresQuery(sql, values = [], callback = () => { return false }) {
    return new Promise((resolve, reject) => {
        if(values.length > 0) {
            postgresConnection.query(sql, values, function(err, rows){
                if(callback() !== false) callback(sql)
                if(err) reject(err)
                resolve(rows)
            })
        } else {
            postgresConnection.query(sql, function(err, rows){
                if(callback() !== false) callback(sql)
                if(err) reject(err)
                resolve(rows)
            })
        }
    })
}

module.exports = {
    mysqlQuery,
    postgresQuery
}