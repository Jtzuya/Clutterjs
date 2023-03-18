/**
 * CSR Profiler
 *
 */
document.addEventListener('DOMContentLoaded', initProfiler)

function initProfiler() {
    let profiler = document.querySelector('profiler')
    if(document.body.contains(profiler) == true) {
        appendProfiler(JSON.parse(profiler.innerHTML))
    } else {
        return
    }
}

function appendProfiler(datas) {
    if(document.body.contains(document.querySelector('profiler')) == true) {
        hideProfiler()
    }
    
    if(datas.isEnabled === false) {
        return false
    } else {
        let sect = document.createElement('profilerEmbed')
        profilerStylesHandler(sect)
    
        // element tags
        let divBench = elementCreator('div')
        let getReq = elementCreator('div')
        let postReq = elementCreator('div')
        let memoryUsage = elementCreator('div')
        let uri = elementCreator('div')
        let classMethod = elementCreator('div')
        let queries = elementCreator('div')
    
        // benchmarks
        sect.appendChild(divBench)
        divBench.appendChild(elementCreator('h5', 'Benchmarks:'))
        divBench.appendChild(elementCreator('h5', `Total Time: ${datas.totalExec}`))
        divBench.appendChild(elementCreator('hr'))
    
        // get request
        sect.appendChild(getReq)
        getReq.appendChild(elementCreator('h5', 'Get Data:'))
        getReq.appendChild(elementCreator('p', `${datas.data.requestType == 'GET' && JSON.stringify(datas.data.requestData) !== '{}' ? JSON.stringify(datas.data.requestData) : 'No GET data exists'}`))
        getReq.appendChild(elementCreator('hr'))
    
        // memory usage
        sect.appendChild(memoryUsage)
        memoryUsage.appendChild(elementCreator('h5', 'Memory Usage:'))
        memoryUsage.appendChild(elementCreator('p', `${datas.data.memoryUsage !== 0 || datas.data.memoryUsage.toString() !== 'NaN' ? datas.data.memoryUsage : '0 bytes'}`))
        memoryUsage.appendChild(elementCreator('hr'))
    
        // post request
        sect.appendChild(postReq)
        postReq.appendChild(elementCreator('h5', 'Post Data:'))
        postReq.appendChild(elementCreator('p', `${datas.data.requestType == 'POST' ? JSON.stringify(datas.data.requestData) : 'No POST data exists'}`))
        postReq.appendChild(elementCreator('hr'))
    
        // URI String
        sect.appendChild(uri)
        uri.appendChild(elementCreator('h5', 'URI String:'))
        uri.appendChild(elementCreator('p', `${datas.data.uriString !== '' ? datas.data.uriString : 'No URI data exists'}`))
        uri.appendChild(elementCreator('hr'))
    
        // Class/Method
        sect.appendChild(classMethod)
        classMethod.appendChild(elementCreator('h5', 'Class/Method:'))
        classMethod.appendChild(elementCreator('p', `${datas.data.uriString !== '' ? datas.data.uriString : 'No URI data exists'}`))
        classMethod.appendChild(elementCreator('hr'))
    
        // Queries
        sect.appendChild(queries)
        queries.appendChild(elementCreator('h5', 'Queries:'))
        if(datas.query.length > 0) {
            for(let i = 0; i < datas.query.length; i++) {
                queries.appendChild(elementCreator('p', datas.query[i]))
            }
        } else {
            queries.appendChild(elementCreator('p', 'Database driver is not currently loaded'))
        }
    
        if(document.body.contains(document.querySelector('profilerembed')) == true) {
            document.querySelector('profilerembed').remove()
            document.body.appendChild(sect)
        } else {
            document.body.appendChild(sect)
        }
    }
}

function hideProfiler() {
    let profiler = document.querySelector('profiler')
    profiler.remove()
}

function profilerStylesHandler(tag) {
    tag.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        max-width: 350px;
        padding: 1rem 1.5rem;
        background-color: papayawhip;
        border-top-right-radius: 5px;
        word-wrap: break-word;
        max-height: 600px;
        overflow-y: scroll;
    `
}

function elementCreator(tagName, context = '') {
    let tag = document.createElement(tagName)
    if(context !== '') tag.textContent = context
    return tag
}