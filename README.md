### Enabling Profiler  
- profiler only supported on controllers  
Profiler Updates: profiler setter (enableProfiler method) is not at the utils.js folder within  
the profiler class to remove redundancy. Previously was added inside each model  

get method:   
- routes     
```js Router.get('/', MasterController.index, Profiler.exec) ```    

- controllers   
```js  
    // require Profiler class which is inside the utils.js file  
    index(req, res, next) {  
        Profiler.enableProfiler(req, true, 'index')  
        next()  

        if(req.session.sessionID !== undefined) {  
            res.redirect('/welcome')
        } else {  
            req.profiler.isEnabled === false ?   
                res.render('index', {   
                    datas: ''   
                }) :    
                req.profiler.render  
        }  
    }  
```  
   
post method:   
- routes    
```js Router.post('/register', MasterController.register, Profiler.exec) ```   

- controllers  
```js  
    async register(req, res, next) {
        Profiler.enableProfiler(req, true, './dumpster/index')
        
        let formData = req.body
        let register = await model.User.register(formData)

        // next() was placed here since we are querying from the db and we want to get sql query info from there
        register.profilerInfo = req.profiler
        req.profiler.query = register
        next()

        req.profiler.isEnabled === false ? 
            res.render('./dumpster/index', { 
                datas: JSON.stringify(register),
            }) : 
            req.profiler.render
    }
```

Getting SQL query in Models
```js  
    // Using Profiler
    let req = await mysqlQuery(sql, [], Profiler.sqlConfig)

    // Without Profiler
    let req = await mysqlQuery(sql)
```