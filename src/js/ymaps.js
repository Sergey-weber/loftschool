function initMap() {
    ymaps.ready(function () {
        var mapCenter = [55.755381, 37.619044],
            map = new ymaps.Map('map', {
                center: mapCenter,
                zoom: 9,
                controls: []
            });

        // Создаем собственный макет с информацией о выбранном геообъекте.
        var customItemContentLayout = ymaps.templateLayoutFactory.createClass(
            // Флаг "raw" означает, что данные вставляют "как есть" без экранирования html.
            '<h2 class=ballon_header>{{ properties.balloonContentHeader|raw }}</h2>' +
            '<div class=ballon_body>{{ properties.balloonContentBody|raw }}</div>' +
            '<div class=ballon_footer>{{ properties.balloonContentFooter|raw }}</div>'
        );

        var clusterer = new ymaps.Clusterer({
            clusterDisableClickZoom: true,
            clusterOpenBalloonOnClick: true,
            // Устанавливаем стандартный макет балуна кластера "Карусель".
            clusterBalloonContentLayout: 'cluster#balloonCarousel',
            // Устанавливаем собственный макет.
            clusterBalloonItemContentLayout: customItemContentLayout,
            // Устанавливаем режим открытия балуна.
            // В данном примере балун никогда не будет открываться в режиме панели.
            clusterBalloonPanelMaxMapArea: 0,
            // Устанавливаем размеры макета контента балуна (в пикселях).
            clusterBalloonContentLayoutWidth: 200,
            clusterBalloonContentLayoutHeight: 130,
            // Устанавливаем максимальное количество элементов в нижней панели на одной странице
            clusterBalloonPagerSize: 5
            // Настройка внешнего вида нижней панели.
            // Режим marker рекомендуется использовать с небольшим количеством элементов.
            // clusterBalloonPagerType: 'marker',
            // Можно отключить зацикливание списка при навигации при помощи боковых стрелок.
            // clusterBalloonCycling: false,
            // Можно отключить отображение меню навигации.
            // clusterBalloonPagerVisible: false
        });

        const modalForm = document.querySelector('.form')
        const inputModal = document.querySelectorAll('input')
        const sendComment = document.querySelector('.send_comment')

        // Слушаем клик на карте.
        map.events.add('click', function (e) {

            modalForm.style.display = 'block'

            var coords = e.get('coords');
            console.log(coords)

            var placemarks = [];

            sendComment.addEventListener('click', function() {
                let send = false

                for ( let i = 0; i < inputModal.length; i++ ) {
                    inputModal[i].value !== '' ? send = true : send = false
                }

                if (send) {
                    var myPlacemark = new ymaps.Placemark(coords, {
                        // Устаналиваем данные, которые будут отображаться в балуне.
                        balloonContentHeader: inputModal[0].value,
                        balloonContentBody: inputModal[1].value,
                        balloonContentFooter: inputModal[2].value
                    })

                    placemarks.push(myPlacemark)

                    clusterer.add(placemarks);
                    map.geoObjects.add(clusterer);

                    for ( let i = 0; i < inputModal.length; i++ ) {
                        inputModal[i].value = ''
                    }
                    modalForm.style.display = 'none'

                } else {
                    alert('fill in the fields')
                }

            })


        });
        // Создание метки.


        // Заполняем кластер геообъектами со случайными позициями.
        // var placemarks = [];
        // for (var i = 0, l = 10000; i < l; i++) {
        //     var placemark = new ymaps.Placemark(getRandomPosition(), {
        //         // Устаналиваем данные, которые будут отображаться в балуне.
        //         balloonContentHeader: 'Метка №' + (i + 1),
        //         balloonContentBody: getContentBody(i),
        //         balloonContentFooter: 'Мацуо Басё'
        //     });
        //     placemarks.push(placemark);
        // }

        // clusterer.add(placemarks);
        // map.geoObjects.add(clusterer);


        var placemarkBodies;

        function getContentBody(num) {
            if (!placemarkBodies) {
                placemarkBodies = [
                    ['Слово скажу -', 'Леденеют губы.', 'Осенний вихрь!'].join('<br/>'),
                    ['Вновь встают с земли', 'Опущенные дождем', 'Хризантем цветы.'].join('<br/>'),
                    ['Ты свечу зажег.', 'Словно молнии проблеск,', 'В ладонях возник.'].join('<br/>')
                ];
            }
            return '<br>' + placemarkBodies[num % placemarkBodies.length];
        }

        clusterer.balloon.open(clusterer.getClusters()[0]);
    });

}

export {
    initMap
}