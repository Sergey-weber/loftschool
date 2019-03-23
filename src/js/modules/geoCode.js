export function geoCode(coords){
    let address = ymaps.geocode(coords, {
        results: 1
    })
    .then((res) => {
       var firstGeoObject = res.geoObjects.get(0).properties.get('text')
       return  firstGeoObject
   })

    return address
}