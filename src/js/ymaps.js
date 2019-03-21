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
            gridSize: 152,
            clusterDisableClickZoom: true
        });

    // Чтобы задать опции одиночным объектам и кластерам,
    // обратимся к дочерним коллекциям ObjectManager.
    objectManager.objects.options.set({
        preset : 'islands#greenDotIcon',
        hasBalloon : false,
        iconLayout: 'default#image',
        iconImageHref: '../src/img/marker.png',
    });
    objectManager.clusters.options.set('preset', 'islands#greyClusterIcons');
    myMap.geoObjects.add(objectManager);

     objectManager.objects.events.add('click', e => {
        let hint =  e.get('target')._collectionComponent._childList.first.obj._data.properties.hintContent
            coords = e.get('coords')

            var objectId = e.get('objectId'),
                overlay = objectManager.objects.overlays.getById(objectId);
            console.log(overlay)

            console.log(objectManager.objects.getById(e.get("objectId")).properties.type)

           
            e.get('target').options.set('iconImageHref', '../src/img/markerActive.png');

            clearDataList()
            noReviews.style.display = 'none'
            modalForm.style.display = 'block'

    

            for ( let i = 0; i < data.length; i++ ) {

                if ( data[i].properties.hintContent == overlay._data.properties.hintContent ) {
                    console.log(true)
                    // coords = data[i].geometry.coordinates
                    console.log(`data: ${data[i].properties.hintContent} - target ${hint}`)

                    title_address.innerText = data[i].properties.hintContent

                    datesList.appendChild(
                        addDataList(
                            data[i].properties.name,
                            data[i].properties.balloonContentBody,
                            data[i].properties.balloonContentFooter,
                            data[i].properties.createDate
                            )
                        )
                }
            }
          
        
     })

     objectManager.clusters.events.add('click', e => {
        coords = e.get('coords')
     })


    // objectManager.objects.events.add('mouseenter',
    //  function (e) {
    //      var objectId = e.get('objectId'),
    //      overlay = objectManager.objects.overlays.getById(objectId);
    //     setRedColor(objectId);
    //     overlay.events.add('mapchange', setGreenColor);});
    //     objectManager.objects.events.add('mouseleave',
    //      function (e) {
    //          var objectId = e.get('objectId'),
    //         overlay = objectManager.objects.overlays.getById(objectId);
    //         setGreenColor(objectId);
    //         overlay.events.remove('mapchange', setGreenColor);});
    //     function setGreenColor (objectId) {
    //         objectManager.objects.setObjectOptions(objectId, 
    //             {        preset: 'islands#greenIcon'    });}
    //         function setRedColor (objectId) {    objectManager.objects.setObjectOptions(objectId, {        preset: 'islands#redIcon'    });}

    let storage = localStorage
    let data = storage.data ? JSON.parse(storage.data) : []


        objectManager.add(data);

    const modalForm = document.querySelector('#modalForm'),
          map = document.querySelector('#map'),
          title_address = modalForm.querySelector('.title_address a'),
          noReviews = modalForm.querySelector('.noReviews'),
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

        noReviews.style.display = 'block'

        modalForm.style.display = 'block'
        coords = e.get('coords');
        console.log(coords)
        let clientCoords = e.getSourceEvent().originalEvent.clientPixels;
        console.log(`clientCoords: ${clientCoords}`)

        modalForm.style.top = clientCoords[1] + 50 + 'px'
        modalForm.style.left = clientCoords[0] + 50 + 'px'


            geoCode().then(address => title_address.innerText = address)   

            objectManager.objects.each(function (object) { 
                // console.log(objectManager.objects.balloon._collection)
                objectManager.objects.options.set('iconImageHref', '../src/img/marker.png');
            })
        })

    sendComment.addEventListener('click', () => {
        if ( fieldName.value !== '' && fieldAddress.value !== '' && fieldComment.value !== '' ) {
            noReviews.style.display = 'none'
            addPlacemark()
            datesList.appendChild(addDataList(fieldName.value, fieldAddress.value, fieldComment.value, currentDate()))    

        } else {
            alert('Fill in the fields')
        }
    })

    function currentDate() {
        let Data = new Date(),
            Year = Data.getFullYear(),
            Month = Data.getMonth(),
            Day = Data.getDate(),
            Hour = Data.getHours(),
            Minutes = Data.getMinutes(),
            Seconds = Data.getSeconds()
    
        let formated_date = `${Year}.${Month}.${Day} ${Hour}:${Minutes}:${Seconds}`

        return formated_date
    }

    function addPlacemark() {

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
                        "iconLayout": 'default#image',
                        "balloonContentHeader": `<strong class="address"><a href class="openComment" >${address}</a></strong>`,
                        "balloonContentBody": `<span class="writeAddress">${fieldAddress.value} <span class="date">${currentDate()}</span></span>`,
                        "balloonContentFooter": fieldComment.value,
                        "clusterCaption": `<strong class="address"><a href class="openComment" >${address}</a></strong>`,
                        "hintContent": address,
                        "createDate": currentDate()
                    }
                }

                data.push(obj) 
                objectManager.removeAll();
                objectManager.add(data);

                storage.data = JSON.stringify(data)
            }) 
        
    }



    closeModal.addEventListener('click', () => closeWindow())

    map.addEventListener('click', e => {
        e.preventDefault()

        if ( e.target.classList.contains('openComment') ) {
            clearDataList()
            noReviews.style.display = 'none'
            modalForm.style.display = 'block'

            var txt = e.target.textContent || e.target.innerText

            for ( let i = 0; i < data.length; i++ ) {
                if ( data[i].properties.hintContent == txt ) {
                    coords = data[i].geometry.coordinates
                    title_address.innerText = data[i].properties.hintContent

                    datesList.appendChild(
                        addDataList(
                            data[i].properties.name,
                            data[i].properties.balloonContentBody,
                            data[i].properties.balloonContentFooter,
                            data[i].properties.createDate
                            )
                        )
                }
            }
        }
    })

    function addDataList(nameArg, addressArg, commentArg, createDate) {
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