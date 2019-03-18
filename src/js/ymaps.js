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
        dataList.length = 0
        datesList.innerText = ''
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
    })

    function addPlacemark() {
        geoCode().then((address) => {
            if ( fieldName.value !== '' && fieldAddress.value !== '' && fieldComment.value !== '' ) {
                let length = data.length

                let obj = {
                    "type": "Feature",
                    "id": length + 1,
                    "geometry": {
                        "type": "Point",
                        "coordinates": coords},
                        "properties": {
                            "name": fieldName.value,
                            "balloonContentHeader": address,
                            "balloonContentBody": fieldAddress.value,
                            "balloonContentFooter": fieldComment.value,
                            "clusterCaption": `<strong class="address"><a href class="openComment" >${address}</a></strong>`,
                            "hintContent": `<strong><s>${address}</s></strong>`
                        }
                    }

                    data.push(obj) 

                    objectManager.removeAll();
                    objectManager.add(data);

                } else {
                    alert('Fill in the fields')
                }
            })   
    }

    closeModal.addEventListener('click', () => closeWindow())

      map.addEventListener('click', e => {
        e.preventDefault()

        if ( e.target.classList.contains('openComment') ) {
            console.log(e.target)
            datesList.innerText = ''
            dataList.length = 0
            modalForm.style.display = 'block'
            datesList.style.display = 'block'

            var txt = e.target.textContent || e.target.innerText

            for ( let i = 0; i < data.length; i++ ) {
                if ( data[i].properties.balloonContentHeader == txt ) {
                    console.log(data[i])
                    dataList.push(data[i].properties.name)
                    dataList.push(data[i].properties.balloonContentBody)
                    dataList.push(data[i].properties.balloonContentFooter)
                    datesList.innerText = dataList
                }
            }
        }
      })



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
    }
    
})
}

export {
    initMap
}