const { Utils, Profiler } = require('../../core/utils')
const { postgresQuery } = require("../../core/database");

class User {
    async register(registrantInfo) {
        let verificationProcess = await Utils.regVerification(registrantInfo)

        if (verificationProcess.isValid !== true) return verificationProcess

        // check if email exists 
        let sql = `SELECT COUNT(*) as count FROM users WHERE email=$1`
        let values = [registrantInfo.email]
        let res = await postgresQuery(sql, values, Profiler.sqlConfig)

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
        
        res = await postgresQuery(sql, values, Profiler.sqlConfig)
        return verificationProcess
    }

    async login(userInfo) {
        let response = {
            isSuccess: false,
            message: `Nothing found... double check your email`
        }
        
        let sql = `SELECT * FROM users WHERE email=$1`
        let values = [userInfo.email]
        let res = await postgresQuery(sql, values)

        if(res.rows.length > 0) {
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

    async getUserInfo(userId) {
        let sql = `SELECT * FROM users WHERE id=$1`
        let values = [userId]

        let res = await postgresQuery(sql, values)
        return res.rows[0]
    }
}

module.exports = new User