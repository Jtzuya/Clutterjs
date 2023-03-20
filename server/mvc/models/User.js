const { Utils, Profiler } = require('../../core/utils')
// you can just replace mysqlQuery with postgresQuery easily and vice-versa
const { conf } = require('../../core/config')
const { mysqlQuery, postgresQuery, redisClient } = require("../../core/database");

class User {
    async register(registrantInfo) {
        let verificationProcess = await Utils.regVerification(registrantInfo)
        // console.log(verificationProcess.isValid)

        if (verificationProcess.isValid !== true) return verificationProcess

        // check if email exists 
        let sql = `SELECT COUNT(*) as count FROM users WHERE email=$1`
        let values = [registrantInfo.email]

        // fourth argument will be the value that redis will be targeting
        // fifth argument will be the method that redis will be using
        let res = await postgresQuery({
            sql, 
            values, 
            callback: Profiler.sqlConfig
        })

        /*
            can query something like this others 4 params are optional
            let random = await postgresQuery({
                sql: `select * from users where email='jtzuya@gmail.com'`,
            })
            console.log(random, '💩')
        */

        if(parseInt(res.rows[0].count) > 0) {
            verificationProcess.response = 'Use a different email'
            return verificationProcess
        }

        sql = `INSERT INTO users (email, first_name, last_name, password, created_at) VALUES ($1, $2, $3, $4, $5)`;
        values = [
            registrantInfo.email,
            registrantInfo.firstName,
            registrantInfo.lastName,
            registrantInfo.password,
            Utils.getCurrentDate()
        ]
        
        res = await postgresQuery({
            sql, 
            values, 
            callback: Profiler.sqlConfig
        })

        return verificationProcess
    }

    async login(userInfo, redisSession = {}) {        
        let sql = `SELECT * FROM users WHERE email=$1`
        let values = [userInfo.email]
        // console.log(session)

        return await this.redisHelper(sql, values, userInfo, redisSession)
    }

    async getUserInfo(userId, redisSession) {
        const {
            _rGet = redisSession.client.get,
            _rSet = redisSession.client.set,
            _rSerialize = (value) => { return JSON.parse(value) },
            _rDeSerialize = (value) => { return JSON.stringify(value) },
        } = redisSession

        let sql = `SELECT * FROM users WHERE id=$1`
        let values = [userId]

        let redisDB = await _rGet('user')
        if(redisDB !== null && _rSerialize(redisDB)[0].id == userId) {
            return _rSerialize(redisDB)[0]
        } else {
            let res = await postgresQuery({sql, values})
            return res.rows[0]
        }
    }

    async redisHelper(sql, values, userInfo, redisSession) {
        let response = {
            isSuccess: false,
            message: `Nothing found... double check your email`
        }

        const {
            _rGet = redisSession.client.get,
            _rSet = redisSession.client.set,
            _rSerialize = (value) => { return JSON.parse(value) },
            _rDeSerialize = (value) => { return JSON.stringify(value) },
        } = redisSession
        
        let redisDB = await _rGet('user')
        if(redisDB !== null && _rSerialize(redisDB)[0].email == userInfo.email) {
            console.log('from redis')
            let result = _rSerialize(redisDB)
            response = {
                isSuccess: true,
                message: `Login successful`,
                id: result[0].id,
                result: result[0]
            }
            return response 
        }

        // continue if redis does not have that user
        console.log('continue....')
        let res = await postgresQuery({
            sql,
            values,
            redisTarget: 'email',
            redisSetKey: 'user'
        })

        if(res.rows.length > 0) {
            // from postgres
            response = typeof(Utils.regPasswordValidator(res.rows[0].password, userInfo.password)) !== 'boolean' ? { 
                    isSuccess: response.isSuccess, 
                    message: `Nothing found... re-enter password`
                } : { 
                    isSuccess: true, 
                    message: `Login successful`,
                    id: res.rows[0].id
                }
            return response
        } else {
            return response
        }
    }
}

module.exports = new User