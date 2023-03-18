const { Utils, Profiler } = require('../../core/utils')
// you can just replace mysqlQuery with postgresQuery easily and vice-versa
const { mysqlQuery } = require("../../core/database");

class User {
    async register(registrantInfo) {
        let verificationProcess = await Utils.regVerification(registrantInfo)

        if (verificationProcess.isValid !== true) return verificationProcess

        // check if email exists 
        let whereClause = 'email = ?'
        let sql = `SELECT COUNT(*) as count FROM testing.users WHERE ` + whereClause
        let values = [registrantInfo.email]
        let res = await mysqlQuery(sql, values, Profiler.sqlConfig)
        

        if(res[0].count > 0) {
            verificationProcess.response = 'Use a different email'
            return verificationProcess
        }

        if(res[0].count > 0) {
            verificationProcess.response = 'Use a different email'
            return verificationProcess
        }

        sql = `INSERT INTO testing.users (email, first_name, last_name, password, created_at) values (?)`;
        values = [
            registrantInfo.email,
            registrantInfo.firstName,
            registrantInfo.lastName,
            registrantInfo.password,
            Utils.getCurrentDate()
        ]
        
        res = await mysqlQuery(sql, values, Profiler.sqlConfig)
        if(res.warningCount !== 0) verificationProcess.response = 'Something went wrong while registering. Please contact our chat support to resolve this matter'

        return verificationProcess
    }

    async login(userInfo) {
        let response = {
            isSuccess: false,
            message: `Nothing found... double check your email`
        }
        let whereClause = 'email = ?'
        let sql = `SELECT * FROM users.users WHERE ` + whereClause
        let values = [userInfo.email]

        let res = await mysqlQuery(sql, values)

        if(res.length > 0) {
            response = typeof(Utils.regPasswordValidator(res[0].password, userInfo.password)) !== 'boolean' ? { 
                    isSuccess: response.isSuccess, 
                    message: `Nothing found... re-enter password`
                } : { 
                    isSuccess: true, 
                    message: `Login successful`,
                    id: res[0].id
                }
            return response
        } else {
            return response
        }
    }

    async getUserInfo(userId) {
        let whereClause = 'id = ?'
        let sql = `SELECT * FROM users.users WHERE ` + whereClause
        let values = [userId]

        let res = await mysqlQuery(sql, values)
        return res[0]
    }
}

module.exports = new User