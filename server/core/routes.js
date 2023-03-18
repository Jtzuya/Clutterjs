const Express = require('express')
// const { Express } = require('../../app')
const Router = Express.Router()

const controllers = require('../mvc/controllers/index')
const { Profiler } = require('./utils')

/**
 *  | Second argument of the router (middleware):
 *  | controllers.class.method
 *  |
 *  | controllers: The declaration for all imported modules
 *  | from index.js that's inside the controllers directory.
 *  | 
 *  | class: The name of the exported module
 *  | 
 *  | method: The name of the method within the class
 *  | 
 *  | i.e.
 *  |   controller.Users.index
 *  | ------------------------------------------------------
 *  |
 *  | Third argument of the router (optional middleware):
 *  | class.method
 *  | 
 *  | 
 *  | Things to be consider: You can set an infinite amount
 *  | of middleware but in this case, we are just using the
 *  | Profiler class as middleware. get and post both can 
 *  | leverage this trick.
 */

// GET
Router.get('/', controllers.Users.index, Profiler.exec)
Router.get('/welcome', controllers.Users.welcome, Profiler.exec)
Router.get('/students/profile', controllers.Users.profile)
Router.get('/search', controllers.Searches.search, Profiler.exec)

// POST
Router.post('/login', controllers.Users.login, Profiler.exec)
Router.post('/logout', controllers.Users.logout, Profiler.exec)
Router.post('/register', controllers.Users.register, Profiler.exec)
Router.post('/searching', controllers.Searches.searching, Profiler.exec)

/**
 *  Explanation why I require the express module and export
 *  it from here is because Router is part of the express
 *  and also not to make myself repeat things. It also make
 *  sense to require the express module on the app.js which
 *  is the file that spin up the server, the downside is that
 *  we won't be able to run this Router because, it was declared
 *  at the later part which is late while we are already listening
 *  to the server. 
 * 
 *  Main takeaway: For this implementation, requiring the express
 *  module inside the app.js is sort of a verbose and tedious way
 *  of doing things.
 */

module.exports = {
    Express,
    Router
}

/**
 * module.exports = { Router }
 */