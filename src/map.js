
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
import { fromLonLat, get as getProjection } from 'ol/proj';



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
                zoom: 8
            })
        });
    }

    addMarker(name, long, lat, zoomLvl) {
        long = parseFloat(long);
        lat = parseFloat(lat);
        let iconFeature = new Feature({
            geometry: new Point(fromLonLat([long, lat])),
        });
        this.map.addLayer(new VectorLayer({
            source: new VectorSource({
                features: [iconFeature]
            }),
            style: new Style({
                image: new Circle({
                    radius: 6,
                    stroke: new Stroke({
                        color: '#fff'
                    }),
                    fill: new Fill({
                        color: 'red'
                    })
                })
            })
        }));
        // this.map.getView().setCenter(ol.proj.transform([lat, long], 'EPSG:4326', 'EPSG:3857'));  
        this.map.getView().setZoom(zoomLvl);

    }
}

export default OLMap;