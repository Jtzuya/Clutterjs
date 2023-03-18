const session = require('express-session')
const bodyParser = require('body-parser')
const config = require('./server/core/config.js')
const { Express, Router } = require('./server/core/routes')
// const Express = require('express')
// const Router = require('./server/core/routes')

const app = Express()

app.use(Express.static(__dirname + '/client'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(session({
    secret: 'sekretoparabibo',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60000
    }
}))

app.set('views', __dirname + '/server/mvc/views')
app.set('view engine', 'ejs')

app.use(Router)
app.listen(config.port, (() => { console.log(`Listening on port http://localhost:${config.port}`) }))
/**
 * module.exports = { Express }
 */


