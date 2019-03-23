export function addDataList(nameArg, addressArg, commentArg, createDate) {
    let nameVal = document.createElement('span')
    nameVal.innerHTML = nameArg || ''

    let addressVal = document.createElement('span')
    addressVal.innerHTML = addressArg || ''

    let dateVal = document.createElement('span')
    dateVal.innerHTML = createDate

    let commentVal = document.createElement('div')
    commentVal.innerHTML = commentArg || ''

    let p = document.createElement('p')
    p.classList.add('nameAddress')
    p.appendChild(nameVal)
    p.appendChild(addressVal)
    p.appendChild(dateVal)

    let wrap = document.createElement('div')
    wrap.appendChild(p)
    wrap.appendChild(commentVal)

    return wrap
}