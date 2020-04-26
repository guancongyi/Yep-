
import 'jquery'
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import { Fill, Stroke, Circle, Style } from 'ol/style';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat, get as getProjection, transform } from 'ol/proj';



class OLMap {
    constructor(id) {
        this.domId = '#' + id;
        this.map = new Map({
            target: id,
            layers: [
                new TileLayer({
                    source: new OSM()
                })
            ],
            view: new View({
                center: fromLonLat([-118.286324, 34.020318]),
                zoom: 10
            })
        });
    }

    addMarkers(names, locations, zoomLvl) {
        let source = new VectorSource({})

        for (let i = 0; i < locations.length; i++) {
            let long = parseFloat(locations[i][0]);
            let lat = parseFloat(locations[i][1]);
            var geom = new Point(fromLonLat([long, lat]));
            var feature = new Feature(geom);
            source.addFeature(feature);
        }

        this.map.addLayer(new VectorLayer({
            source: source,
            style: new Style({
                image: new Circle({
                    radius: 10,
                    stroke: new Stroke({
                        color: '#fff',
                    }),
                    fill: new Fill({
                        color: 'red'
                    })
                })
            })
        }));

        if (locations.length == 1) {
            this.map.getView().setCenter(transform([parseFloat(locations[0][0]), parseFloat(locations[0][1])], 'EPSG:4326', 'EPSG:3857'));
            this.map.getView().setZoom(zoomLvl);
        }else{
            this.map.getView().setCenter(transform([ -101.958158,40.094415], 'EPSG:4326', 'EPSG:3857'));
            this.map.getView().setZoom(5);
        }


    }



}

export default OLMap;