const session = require('express-session')
const bodyParser = require('body-parser')

const { Express, Router } = require('./server/core/routes')
const { redisClient } = require('./server/core/database')
const redisStore = require('connect-redis').default
const conf = require('./server/core/config.js')
const app = Express()

conf.redisDatabase.client = redisClient
conf.session.store = new redisStore(conf.redisDatabase)

// console.log(conf.session)

app.use(Express.static(__dirname + '/client'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session(conf.session))
app.use(bodyParser.json())

app.set('views', __dirname + '/server/mvc/views')
app.set('view engine', 'ejs')

app.use(Router)
app.listen(conf.port, () => { console.log(`Listening on port http://localhost:${conf.port}`) })