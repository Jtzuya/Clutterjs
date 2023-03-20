const model = require('../models/index')
const { Profiler } = require('../../core/utils')

class Users {
    // ALL GET REQUEST
    index(req, res) {
        if(req.session.sessionID !== undefined) {
            return res.redirect('/welcome')
        }

        res.render('index')
    }

    async profile(req, res) {
        if(req.session.sessionID !== undefined) {
            let info = await model.User.getUserInfo(req.session.sessionID, req.sessionStore) // second param for redis
            return res.render('profile', { info: info })
        }

        res.redirect('/')
    }

    welcome(req, res) {
        if(req.session.sessionID !== undefined) {
            res.render('welcome')
        }

        res.redirect('/')
    }

    // ALL POST REQUEST
    async login(req, res) {
        let formData = req.body
        let login = await model.User.login(formData, req.sessionStore) // second parameter for redis
        // console.log('🐣', login)
        if(login.isSuccess == true) req.session.sessionID = login.id
        res.render('./dumpster/index', {datas: JSON.stringify(login)})
    }

    async register(req, res) {
        let formData = req.body
        let register = await model.User.register(formData)
        res.render('./dumpster/index', {datas: JSON.stringify(register)})
    }

    async logout(req, res) {
        delete req.session.sessionID
        res.render('./dumpster/index', {datas: JSON.stringify({ action: 'logout' })})
    }
}

module.exports = new Users