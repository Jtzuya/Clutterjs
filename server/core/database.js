/*
    DATABASE CONFIGURATION: 
    https://blog.logrocket.com/build-rest-api-node-express-mysql/
    https://codeburst.io/node-js-mysql-and-async-await-6fb25b01b628
*/

const conf = require('./config.js')
const mysql = require('mysql')
const {Client} = require('pg') // postgres
const redis = require('redis')

const mysqlConnection = mysql.createConnection(conf.mysqlDatabase)

const postgresConnection = new Client(conf.postgresDatabase)
postgresConnection.connect() // turn off connection to terminate TCPConnectWrap.afterConnect error

const redisClient = redis.createClient()
redisClient.connect()

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

// async function postgresQuery(params) {
//     const {
//         sql,
//         values = params.values == undefined ? [] : params.values,
//         callback = params.callback == undefined ? () => {
//                         return false
//                     } : params.callback, 
//         target = params.redisTarget == undefined ? '' : params.redisTarget,
//         key = params.redisSetKey == undefined ? '' : params.redisSetKey
//     } = params

//     return new Promise((resolve, reject) => {
//         if(callback() !== false) callback(sql) // for profiler data
//         postgresConnection.query(sql, values, function(err, result){
//             if(err) reject(err)
//             resolve(result)

//             // set
//             redisClient.set(key, JSON.stringify(result.rows))
//         })
//     })
// }

/*
    function postgresQuery(params) {
        const {
            sql,
            values = params.values == undefined ? [] : params.values,
            callback = params.callback == undefined ? () => {
                            return false
                        } : params.callback, 
            target = params.redisTarget == undefined ? '' : params.redisTarget,
            key = params.redisSetKey == undefined ? '' : params.redisSetKey
        } = params

        return new Promise((resolve, reject) => {
            if(callback() !== false) callback(sql) // for profiler data
            redisClient.GET(key, (err, res) => {
                if(err) console.error(err)
                if(res !== null && JSON.parse(res).email == target) {
                    console.log('from redis')
                    resolve(JSON.parse(res))
                } else {
                    console.log('from postgres')
                    postgresConnection.query(sql, values, function(err, result){
                        if(err) reject(err)
                        resolve(result)
            
                        // set
                        console.log(result)
                        redisClient.SETEX(key, 10, JSON.stringify(result.rows))
                    })
                }
            })
        })
    }
*/

async function postgresQuery(params) {
    const {
        sql,
        values = params.values == undefined ? [] : params.values,
        callback = params.callback == undefined ? () => {
                        return false
                    } : params.callback, 
        target = params.redisTarget == undefined ? '' : params.redisTarget,
        key = params.redisSetKey == undefined ? '' : params.redisSetKey
    } = params

    return new Promise((resolve, reject) => {
        if(callback() !== false) callback(sql) // for profiler data
        postgresConnection.query(sql, values, function(err, result){
            if(err) reject(err)
            resolve(result)

            // set
            console.log('from postgres')
            console.log('setting data to redis')
            redisClient.SET(key, JSON.stringify(result.rows))
        })
    })
}

module.exports = {
    mysqlQuery,
    postgresQuery,
    redisClient
}