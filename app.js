const session = require('express-session')
const bodyParser = require('body-parser')

const conf = require('./server/core/config.js')
const { Express, Router } = require('./server/core/routes')
const { redisClient } = require('./server/core/database')
// const Express = require('express')
// const Router = require('./server/core/routes')

const redisStore = require('connect-redis').default

const app = Express()

app.use(Express.static(__dirname + '/client'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(session({
    secret: 'sekretoparabibo',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60000,
        secure: false
    },
    store: new redisStore({
        host: 'localhost',
        port: 6379,
        ttl: 86400,
        client: redisClient
    })
}))

app.set('views', __dirname + '/server/mvc/views')
app.set('view engine', 'ejs')

app.use(Router)
app.listen(conf.port, () => { console.log(`Listening on port http://localhost:${conf.port}`) })

/**
 * module.exports = { Express }
 */


