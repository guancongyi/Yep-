// HEllO

import 'jquery'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-table/dist/bootstrap-table.css'
import 'bootstrap-table/dist/bootstrap-table'
import Table from './table'
import getData from './request'

import '../assets/css/index.css'
// import OLMap from './map'

let index_table = {
    'world': 'world_index',
    'us_restaurant': 'yelp_index',
    // 'world_restaurant': 'world_restaurant_index', 
}


// let map = new OLMap('map');
let currDB = "";
let tables = new Array(3);


// main
(function init() {
    $('#load_more1').click(() => {
        if (tables[0] != "") {
            tables[0].loadMore()
        }
    })
    $('#submit').click(function () {
        tables.forEach((item) => {
            item.destroy();
            /******* DELETE TABLE HEADERS ******/
            $(item.id).children("#tb_header").empty();
            /******* DELETE TABLE HEADERS ******/
        })
        let keywords = $('#keyword').val();
        getData(index_table[currDB], undefined, undefined, keywords).done((data) => {
            console.log(data)
            // console.log(tables)
            let obj = {}
            data.forEach((item, id) => {
                // console.log(item,id);
                let tbName = item[0];
                obj[tbName] ? obj[tbName].push(item[2]) : obj[tbName] = [item[2]]
            })
            console.log(obj)
            let allData = Object.values(obj)

            for (let i = 0; i < allData.length; i++) {
                tables[i] = new Table('#t' + (i + 1), undefined, allData[i], 50, true)
            }
        })
    });

    // input change event listener
    $('#select_db input').on('change', function () {
        console.log(tables)
        tables.forEach((item) => {
            console.log(item)
            item.destroy()
        })
        currDB = $('input[name=db]:checked', '#select_db').val();

        // get default data
        if (currDB == 'world') {
            appendFilters();
            // ajax get data using RESTApi
            getData("country2").done((data) => {
                console.log(data)
                // conver data to list format [{d1},{d2}...]
                let dataInArray = Object.keys(data).map((key) => {
                    return data[key]
                })
                // render table based on data
                tables[0] = new Table('#t1', "country2", dataInArray);
            })
        } else if (currDB == 'world_restaurant') {
            appendFilters();
            // to do
        } else {

            appendFilters();
            getData("yelp_business").done((data) => {
                let dataInArray = Object.keys(data).map((key) => {
                    return data[key]
                })
                // console.log(dataInArray)
                tables[0] = new Table('#t1', "yelp_business", dataInArray);
            })
        }

    });
})();


function appendFilters() {
    $('#filter_options').empty();
    $('#filter_options').append('<p><b>Keyword Search: </b></p>');
    $('#filter_options').append('<input id="keyword" placeholder="Enter keywords here"></input>');
    $('#submit').css('display', 'block');
}
