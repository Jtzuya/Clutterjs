const emailProvider = require('../datas/emailDomains')

class Utils {
    viewsHandler(req) {
        if(req.session.viewsHandler) {
            req.session.viewsHandler.views++
        } else {
            req.session.viewsHandler = {
                views: 1,
                reset: false
            } 
        }
    
        if(req.session.viewsHandler !== undefined && req.session.viewsHandler.reset == true) {
            req.session.viewsHandler.views = 2
            req.session.viewsHandler.reset = false
        }
    
        return req.session.viewsHandler.views
    }
    
    // validations
    emailValidator(email) {
        let err = {
            isValid: false,
            response: `${email} is invalid. Please use a different email address`
        }
        let finder = /@/g
        let hasAt = finder.test(email)
    
        if(hasAt !== true) return err
    
        let eEl = email.split('@')    
        return emailProvider[eEl[1]] == eEl[1] ? true : err
    }
    
    nameValidator(name) {
        let err = {
            isValid: false,
            response: `${name} is not a valid name. Please double check your name`
        }
    
        let finder = /\d/g
        let hasNum = finder.test(name)
        
        if(hasNum == true ) return err // name should'nt have a number
    
        if(name.length < 3) {
            // name should be 3 or more than 3 chars
            err.response = `name should have atleast 3 or more characters but only got ${name.length} ${name.length <= 1 ? 'char' : 'chars'}`
            return err
        }
    
        return true // if returns true means the name is valid
    }

    regPasswordValidator(pass1, pass2) {
        let err = {
            isValid: false,
            response: `password insync`
        }
        
        return pass1 == pass2 ? true : err
    }

    regVerification(registrantInfo) {
        let errs = []

        // name validation
        let firstName = this.nameValidator(registrantInfo.firstName)
        let lastName = this.nameValidator(registrantInfo.lastName)
        
        firstName !== true ? errs.push(firstName.response) : ''
        lastName !== true ? errs.push(lastName.response) : ''
    
        // email validation
        let email = this.emailValidator(registrantInfo.email)
        email !== true ? errs.push(email.response) : ''
    
        // pass validation
        let pass = this.regPasswordValidator(registrantInfo.password, registrantInfo.confirmPass)
        pass !== true ? errs.push(pass.response) : ''
    
        if(errs.length <= 0) {
            // no error
            // proceed adding to db, then be able to send success message
            // be able to login what's registered
            return {
                isValid: true,
                response: `${registrantInfo.firstName.toUpperCase()} successfully registered. 🐔`
            }
        } else {
            // has errors
            return {
                isValid: false,
                response: errs
            }
        }
    }

    searchFilter(formData) {
        /**
         * What this filter can look up
         * - sports
         * - gender
         * - search text [player names]
         */
        let name = ''
        let gender = []
        let sports = []
        let clauses = []
        let clauseCombine = ``

        for(const key in formData) {
            if(key == 'search_input' && formData['search_input'] !== '') {
                name = `name LIKE '%${formData[key]}%'`
            }

            if(key == 'gender_1' || key == 'gender_2') {
                gender.push(`gender='${formData[key]}'`)
            }

            if(key == 'sport-1' || key == 'sport-2' || key == 'sport-3' || key == 'sport-4' || key == 'sport-5' || key == 'sport-6') {
                sports.push(`sport='${formData[key]}'`)
            }
        }

        if(name !== '') {
            clauses.push(name)
        }

        if(gender.length > 1) {
            clauses.push(gender.join(' OR '))
        } else if(gender.length === 1) {
            clauses.push(gender[0])
        }

        if(sports.length > 1) {
            clauses.push(sports.join(' OR '))
        } else if(sports.length === 1) {
            clauses.push(sports[0])
        }

        if(clauses.length > 1) {
            clauseCombine = clauses.join(' AND ')
        } else if(clauses.length === 1) {
            clauseCombine = clauses[0]
        }
        
        return `SELECT name, sport FROM sports_players WHERE ${clauseCombine};`
    }

    // dates
    getCurrentDate() {
        let hMS = ''

        let date = new Date()
        let dateSplit = date.toISOString().split('T')

        for(let i = 0; i < dateSplit[1].length; i++) {
            if(dateSplit[1][i] === '.') break
            hMS += dateSplit[1][i]
        }

        return `${dateSplit[0]} ${hMS}`
    }
}

let queu = []
class Profiler {
    /*
        enable profiler (must be reassigned to somewhere hidden)
        reason why it was placed here: was placed here since it was extended at Master Controller

        This method will take in three parameters, the request, a bool and misc parameters
        request param: to set profiler object in the request
        bool: is optional, set to false by default, and if 2nd parameter is applied it should
        make sense if you use true when using
    */
    
    enableProfiler(req, bool = false, views = 'index') {
        req.profiler = {
            isEnabled: bool,
            data: {},
            page: {},
            queryData: []
        }

        req.profiler.startExec = performance.now()
        if(bool !== false) req.profiler.HTMLFileName = views

        return
    }

    exec(req, res) {
        if(req.profiler.isEnabled === true) {
            req.profiler.query = []
            req.profiler.queryData = req.profiler.queryData
            req.profiler.data.header = JSON.stringify(req.headers)
            req.profiler.data.requestType = req.method.toLowerCase() == 'post' ? req.method : req.method
            req.profiler.data.requestData = req.body
            req.profiler.data.uriString = req.path
            req.profiler.data.memoryUsage = `${parseInt(req.headers['content-length'], 10)} bytes` // not final

            if(queu.length > 0) {
                req.profiler.query = queu
            }

            req.profiler.endExec = performance.now()
            req.profiler.totalExec = `${(req.profiler.endExec - req.profiler.startExec).toFixed(5)} ms`
            req.profiler.render = res.render(req.profiler.HTMLFileName, {
                datas: JSON.stringify(req.profiler)
            })
        }

        // console.log(req.profiler)
    }

    sqlConfig(sql) {
        queu = []
        queu.push(sql)
    }
}

module.exports = {
    Utils: new Utils,
    Profiler: new Profiler
}