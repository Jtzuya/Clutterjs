document.addEventListener('DOMContentLoaded', init)

function init() {
    let searchBtn = document.querySelector('[name="search"]')
    searchBtn.addEventListener('click', searchHandler)
}

async function searchHandler(e) {
    e.preventDefault()
    let form = e.target.parentElement
    let formData = {}
    let els = form.elements
    let sect = document.querySelector('section')

    for(let i = 0; i < els.length; i++) {
        // console.log(els[i])
        if(els[i].getAttribute('type') == 'checkbox' && els[i].checked === true) {
            formData[els[i].getAttribute('name')] = els[i].value
        }

        if(els[i].getAttribute('name') == 'search_input' && els[i].value !== '') {
            formData[els[i].getAttribute('name')] = els[i].value
        }
    }
    
    let searchReq = await fetch(form.getAttribute('action'), {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })

    searchReq.json().then(datas => {
        if(datas.isEnabled == true) appendProfiler(datas)
        
        if(datas.queryData.length <= 0) {
            sect.innerHTML = ''
            let p = document.createElement('p')
            p.style.cssText = "position: absolute; left: 50%; top: 20%; transform: translate(-50%, -50%); font-size: 2rem; text-align: center; width: 100%;"
            p.textContent = 'No athlete found'
            sect.appendChild(p)
        } else {
            sect.innerHTML = ''
            let div, divImg, p1, p2
            
            for(let i = 0; i < datas.queryData.length; i++) {
                div = document.createElement('div')
                divImg = document.createElement('div')
                p1 = document.createElement('p')
                p2 = document.createElement('p')
                
                div.classList.add('athlete')
                divImg.classList.add('img')

                p1.innerText = datas.queryData[i].name
                p2.innerText = `(${datas.queryData[i].sport})`

                div.appendChild(divImg)
                div.appendChild(p1)
                div.appendChild(p2)
                sect.appendChild(div)
            }
        }
    })
}