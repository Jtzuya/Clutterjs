const model = require('../models/index')
const { Profiler } = require('../../core/utils')

class Users {
    // ALL GET REQUEST
    index(req, res) {
        if(req.session.sessionID !== undefined) {
            res.redirect('/welcome')
        } else {
            res.render('index')
        }
        // console.log(req.session)
    }

    async profile(req, res) {
        // console.log(req.session)
        if(req.session.sessionID !== undefined) {
            let info = await model.User.getUserInfo(req.session.sessionID)
            res.render('profile', { info: info })
        } else {
            res.redirect('/')
        }
    }

    welcome(req, res) {
        // console.log(req.session)
        if(req.session.sessionID !== undefined) {
            res.render('welcome')
        } else {
            res.redirect('/')
        }
    }

    // ALL POST REQUEST
    async login(req, res) {
        let formData = req.body
        let login = await model.User.login(formData)
        console.log('🐣', login)
        if(login.isSuccess == true) req.session.sessionID = login.id
        res.render('./dumpster/index', {datas: JSON.stringify(login)})
    }

    async register(req, res) {
        let formData = req.body
        let register = await model.User.register(formData)
        res.render('./dumpster/index', {datas: JSON.stringify(register)})
    }

    async logout(req, res) {
        console.log(req.session)
        delete req.session.sessionID
        res.render('./dumpster/index', {datas: JSON.stringify({ action: 'logout' })})
    }
}

module.exports = new Users