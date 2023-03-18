// let resetBtn = document.querySelector('.reset--btn')
let formBtns = document.querySelectorAll('input[type="submit"]')
window.addEventListener('DOMContentLoaded', init)

function init() {
    for(let i = 0; i < formBtns.length; i++) {
        let btn = formBtns[i]
        let val = btn.getAttribute('value')

        switch(val.toLowerCase()) {
            case 'login':
                btn.addEventListener('click', loginHandler)
                break
            case 'register':
                btn.addEventListener('click', registerHandler)
                break
            case 'log off': 
                btn.addEventListener('click', logOffHandler)
                break
        }
    }
}

async function registerHandler(e) {
    e.preventDefault()
    // console.log('meow')

    let formDatas = {}
    let form = e.target.parentElement
    let els = form.elements
    
    for(let i = 0; i < els.length; i++) {
        if(els[i].value !== 'Register') {
            formDatas[els[i].getAttribute('name')] = els[i].value
        }
    }
    // console.log(formDatas)

    let regReq = await fetch(form.getAttribute('action'), {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDatas)
    })
    
    regReq.json().then(data => {
        if(data.isValid == true) {
            alert(data.response)
        } else {
            alert(data.response)
        }
    })
}

async function loginHandler(e) {
    e.preventDefault()
    // console.log('woof')

    let formDatas = {}
    let form = e.target.parentElement
    let els = form.elements
    
    for(let i = 0; i < els.length; i++) {
        if(els[i].value !== 'Login') {
            formDatas[els[i].getAttribute('name')] = els[i].value
        }
    }
    // console.log(formDatas)

    let loginReq = await fetch(form.getAttribute('action'), {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDatas)
    })

    loginReq.json().then(data => {
        console.log(data)
        if(data.isSuccess !== true) {
            alert(data.message)
        } else {
            redirectPath(`${window.origin}/students/profile`)
        }
    })
}

async function logOffHandler(e) {
    e.preventDefault()

    let logOffReq = await fetch('/logout', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: e.target.value })
    })

    logOffReq.json().then(data => {
        console.log(data)
        if(data.action) redirectPath(`${window.origin}/`)
    })
}

function redirectPath(path) {
    return window.location = path
}



// resetBtn.addEventListener('click', resetHandler)
// async function resetHandler(e) {
//     let init = await fetch ('/reset', {
//         method: 'POST'
//     })
//     let res = init.json()
//     res.then(data => {
//         document.querySelector('span').innerText = data
//     })
// }