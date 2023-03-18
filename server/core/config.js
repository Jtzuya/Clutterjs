let conf = {
    port: 8007,
    mysqlDatabase: {
        host: '127.0.0.1', // if host 127.0.0.1 try localhost/localhost:port and vice-versa
        user: 'root',
        password: 'hygienix',
        database: 'lead_gen_business'
    },
    postgresDatabase: {
        host: 'localhost', 
        user: 'postgres',
        port: 5432,
        password: 'root',
        database: 'testing'
    }
}

/**
 * databases:
 *      MYSQL
 *          - users
 *          - lead_gen_business
 * 
 *      POSTGRES
 *          - testing
 */

module.exports = conf