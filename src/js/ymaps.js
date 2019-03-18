function initMap() {
    ymaps.ready(() => {
       var myMap = new ymaps.Map('map', {
            center: [55.76, 37.64],
            zoom: 10
        }, {
            searchControlProvider: 'yandex#search'
        }),
        objectManager = new ymaps.ObjectManager({
            // Чтобы метки начали кластеризоваться, выставляем опцию.
            clusterize: true,
            clusterBalloonContentLayout: 'cluster#balloonCarousel',
            // ObjectManager принимает те же опции, что и кластеризатор.
            gridSize: 32,
            clusterDisableClickZoom: true
        });

    // Чтобы задать опции одиночным объектам и кластерам,
    // обратимся к дочерним коллекциям ObjectManager.
    objectManager.objects.options.set('preset', 'islands#greenDotIcon');
    objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
    myMap.geoObjects.add(objectManager);

    let data =  []

    const modalForm = document.querySelector('#modalForm'),
          map = document.querySelector('#map'),
          title_address = modalForm.querySelector('.title_address a'),
          closeModal = modalForm.querySelector('.closeModal'),
          fieldName = modalForm.querySelector('.fieldName'),
          datesList = modalForm.querySelector('.dataList'),
          fieldAddress = modalForm.querySelector('.fieldAddress'),
          fieldComment = modalForm.querySelector('.fieldComment'),
          sendComment = modalForm.querySelector('.send_comment')

    let coords,
        dataList = []

    myMap.events.add('click', (e) => {
        closeWindow()
        clearDataList()

        modalForm.style.display = 'block'
            coords = e.get('coords');
            console.log(coords)
            let clientCoords = e.getSourceEvent().originalEvent.clientPixels;
            console.log(`clientCoords: ${clientCoords}`)
            // console.log(e.get('target'))


        geoCode().then(address => title_address.innerText = address)   

        objectManager.objects.each(function (object) { 
            console.log(objectManager.objects.balloon._collection)
        })
    })

    sendComment.addEventListener('click', () => {
        addPlacemark()
        datesList.style.display = 'block'
        datesList.appendChild(addDataList(fieldName.value, fieldAddress.value, fieldComment.value))    
    })

    function addPlacemark() {
        if ( fieldName.value !== '' && fieldAddress.value !== '' && fieldComment.value !== '' ) {

            var formated_date = new Date().toISOString().slice(0, 10)
            geoCode().then((address) => {
                let length = data.length
                let obj = {
                    "type": "Feature",
                    "id": length + 1,
                    "geometry": {
                        "type": "Point",
                        "coordinates": coords},
                        "properties": {
                            "name": fieldName.value,
                            "balloonContentHeader": `<strong class="address"><a href class="openComment" >${address}</a></strong>`,
                            "balloonContentBody": `<span class="writeAddress">${fieldAddress.value} <span class="date">${formated_date}</span></span>`,
                            "balloonContentFooter": fieldComment.value,
                            "clusterCaption": `<strong class="address"><a href class="openComment" >${address}</a></strong>`,
                            "hintContent": address
                        }
                    }

                    data.push(obj) 

                    objectManager.removeAll();
                    objectManager.add(data);

                })   
        } else {
            alert('Fill in the fields')
        }
    }



    closeModal.addEventListener('click', () => closeWindow())

      map.addEventListener('click', e => {
        e.preventDefault()
        console.log(data)

        if ( e.target.classList.contains('openComment') ) {
            console.log(e.target)
            clearDataList()
            modalForm.style.display = 'block'
            datesList.style.display = 'block'

            var txt = e.target.textContent || e.target.innerText

            for ( let i = 0; i < data.length; i++ ) {
                console.log('data i ' + data[i].properties.hintContent)
                console.log('txt ' + txt)
                if ( data[i].properties.hintContent == txt ) {
                    console.log('yesss')
                    dataList.push(data[i].properties.name)
                    dataList.push(data[i].properties.balloonContentBody)
                    dataList.push(data[i].properties.balloonContentFooter)
                    // datesList.innerHTML = dataList

                    datesList.appendChild(
                        addDataList(
                            data[i].properties.name,
                            data[i].properties.balloonContentBody,
                            data[i].properties.balloonContentFooter
                            )
                        )
                }
            }
        }
      })

    function addDataList(nameArg, addressArg, commentArg) {
        let nameVal = document.createElement('span')
            nameVal.innerText = nameArg || ''

        let addressVal = document.createElement('span')
            addressVal.innerText = addressArg || ''

        let dateVal = document.createElement('span')
            dateVal.innerText = new Date().toISOString().slice(0, 10)

        let commentVal = document.createElement('div')
            commentVal.innerText = commentArg || ''

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

    function clearDataList() {
        datesList.innerText = ''
        dataList.length = 0
    }


    function geoCode(){
        let address = ymaps.geocode(coords, {
            results: 1
        })
        .then((res) => {
           var firstGeoObject = res.geoObjects.get(0).properties.get('text')
           return  firstGeoObject
       })

        return address
    }

    function closeWindow() {
        modalForm.style.display = 'none'

        fieldName.value = ''
        fieldAddress.value = ''
        fieldComment.value = ''
        clearDataList()
    }
    
})
}

export {
    initMap
}