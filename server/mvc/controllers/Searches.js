const model = require('../models/index')
const { Profiler } = require('../../core/utils')

class Searches {
    // ALL GET REQUEST
    async search(req, res, next) {
        Profiler.enableProfiler(req, true, 'search')

        let renderAthletes = await model.Search.lookUp()
        req.profiler.queryData = renderAthletes
        next()

        /**
         * If using profiler, recommended to use the profiler render
         * It is the same as render but with extended features.
         */
        req.profiler.render

        /**
         * if using profiler but is set to false, suggested to create 
         * declare some conditions like the example below
         * 
            req.profiler.isEnabled === false ? 
                res.render('searches', {
                    datas: JSON.stringify({
                        queryData: searchAthletes,
                        isEnabled: req.profiler.isEnabled
                    })
                }) : 
                req.profiler.render
            *
            * OR recommended to just completely remove the profiler
            * and use the default rendering
            * 
            */
    }

    // ALL POST REQUEST
    async searching(req, res, next) {
        Profiler.enableProfiler(req, true, './dumpster/index')

        let formData = req.body
        let searchAthletes = await model.Search.lookUp(formData)

        // insert new data first before executing the next middleware (which is the profiler)
        req.profiler.queryData = searchAthletes
        next()

        req.profiler.render
    }
}

module.exports = new Searches