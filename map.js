class Map {
    constructor(id) {
        this.domId = '#'+id;
        this.map = new ol.Map({
            target: id,
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
            ],
            view: new ol.View({
                center: ol.proj.fromLonLat([-118.286324, 34.020318]),
                zoom: 8
            })
        });
    }

    addMarker(name, longitude,latitude) {
        let long = parseFloat(longitude);
        let lat = parseFloat(latitude);
        console.log(typeof(long), typeof(lat))
        console.log(long, lat)
        let iconFeature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat([lat, long])),
        });
        this.map.addLayer(new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [iconFeature]
            }),
            style: new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 6,
                    stroke: new ol.style.Stroke({
                        color: '#fff'
                    }),
                    fill: new ol.style.Fill({
                        color: 'red'
                    })
                })
            })
        }));
        this.map.getView().setCenter(ol.proj.transform([lat, long], 'EPSG:4326', 'EPSG:3857'));  
        this.map.getView().setZoom(15);
        
    }

    showMap() {
        $(this.domId).css("display", 'block')
    }

    clearMap() {
        $(this.domId).css("display", 'none');
    }
}

export default Map;