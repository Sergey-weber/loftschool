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
          title_address = document.querySelector('.title_address a'),
          closeModal = document.querySelector('.closeModal'),
          fieldName = document.querySelector('.fieldName'),
          fieldAddress = document.querySelector('.fieldAddress'),
          fieldComment = document.querySelector('.fieldComment'),
          sendComment = document.querySelector('.send_comment')

    // data[0].asd = 'asdf'
    let coords

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
                            "clusterCaption": `<strong class="address"><a onclick="openComment(e)" class="openComment" >${address}</a></strong>`,
                            "hintContent": `<strong><s>${address}</s></strong>`
                        }
                    }

                    data.push(obj) 

                    objectManager.removeAll();
                    objectManager.add(data);
                    console.log(objectManager)
                    console.log(data)
                }
            })


        

        
    })

    closeModal.addEventListener('click', () => closeWindow())

    objectManager.objects.events.add('click', (e) => console.log(e))

    function openComment(e) {
        e.preventDefault()
        console.log('click')
    }


    function geoCode(){
        let address = ymaps.geocode(coords, {
            results: 1
        })
        .then((res) => {
           var firstGeoObject = res.geoObjects.get(0).properties._data.text
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




    // for ( let i = 0; i < 5; i++ ) {
    //     let obj = {
    //         "type": "Feature",
    //     "id": i,
    //     "geometry": {
    //         "type": "Point",
    //         "coordinates": [55.8319 +i+ 3, 37.4119 +i+ 1]},
    //         "properties": {
    //             "balloonContentHeader": "<font size=3><b><a target='_blank' href='https://yandex.ru'>Здесь может быть ваша ссылка</a></b></font>",
    //             "balloonContentBody": "<p>Ваше имя: <input name='login'></p><p><em>Телефон в формате 2xxx-xxx:</em>  <input></p><p><input type='submit' value='Отправить'></p>",
    //             "balloonContentFooter": "<font size=1>Информация предоставлена: </font> <strong>этим балуном</strong>",
    //             "clusterCaption": "<strong><s>Еще</s> одна</strong> метка",
    //             "hintContent": "<strong>Текст  <s>подсказки</s></strong>"
    //         }
    //     }
    //     data[i] = obj
    // }
    
    // objectManager.add(data);
    
})
}

export {
    initMap
}