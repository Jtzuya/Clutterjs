let conf = {
    port: 8007,
    session: {
        secret: 'sekretoparabibo',
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 60000,
            secure: false
        }
    },
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
    },
    redisDatabase: {
        host: 'localhost',
        port: 6379,
        ttl: 86400
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
 * 
 *      REDIS
 */

module.exports = conf