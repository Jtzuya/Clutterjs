const { Utils, Profiler } = require('../../core/utils')
const { mysqlQuery, postgresQuery } = require("../../core/database");

class Search {
    async lookUp(formData = {}) {
        let sql = `SELECT * FROM lead_gen_business.sports_players LIMIT 10`

        if(JSON.stringify(formData) !== '{}') {
            sql = Utils.searchFilter(formData)
        }
        
        let req = await mysqlQuery(sql, [], Profiler.sqlConfig)

        return req
    }
}

module.exports = new Search