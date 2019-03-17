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

    // data[0].asd = 'asdf'
    let coords,
        dataList = []

    myMap.events.add('click', (e) => {
        closeWindow()
        modalForm.style.display = 'block'
            coords = e.get('coords');
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
            if ( fieldName.value !== '' ) {
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

                    dataList.push(fieldName.value)
                    dataList.push(fieldAddress.value)
                    dataList.push(fieldComment.value)

                    datesList.innerText = dataList

                    objectManager.removeAll();
                    objectManager.add(data);

                }
            })   
    }

    closeModal.addEventListener('click', () => closeWindow())

      myMap.geoObjects.events.add('click', e => {
        let target = e.get('target')._collectionComponent._childList.first.obj._data.features

        closeWindow()
        // console.log(e.get('coords'))
            console.log(target)
        for ( let i = 0; i < target.length; i++ ) {
            coords = target[i].geometry.coordinates 
            console.log(coords)
            dataList.push(target[i].properties.name)
            dataList.push(target[i].properties.balloonContentBody)
            dataList.push(target[i].properties.balloonContentFooter)
            datesList.innerText = dataList
        }
      })

      map.addEventListener('click', (e) => {
        e.preventDefault()

        if ( e.target.classList.contains('openComment') ) {
            modalForm.style.display = 'block'
            datesList.style.display = 'block'
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