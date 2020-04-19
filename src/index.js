import 'jquery'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-table/dist/bootstrap-table.css'
import 'bootstrap-table/dist/bootstrap-table'
import Table from './table'
import { GET_DEFAULT, GET_FK, GET_SEARCH_RESULT} from './request'
import getData from './request'

import '../assets/css/index.css'
import OLMap from './map'

let index_table = {
    'world': 'world_index',
    'us_restaurant': 'yelp_index',
    'business_id': 'yelp_bid_index',
    'user_id': 'yelp_uid_index'
    // 'world_restaurant': 'world_restaurant_index', 
}


let map = "";
let currDB = "";
let tables = new Array(3);

function onCellClicked(field, val, tb) {
    // $(this.id).bootstrapTable('destroy');

    if (tb == 'city' || tb == 'country2' || tb == 'countrylanguage') {
        if (field == 'Code' || field == 'CountryCode') {
            console.log(tb)
            resetAllTables()
            getData(index_table['world'], undefined, undefined, val).done((data) => {
                const {names, rows} = formatObjectData(data);
                for (let i = 0; i < rows.length; i++) {
                    tables[i] = new Table('#t' + (i + 1), names[i], rows[i], 50, true, onCellClicked)
                }
            })
        }
    } else if (tb == 'yelp_tip' || tb == 'yelp_business' || tb == 'yelp_user') {
        if (field == 'business_id' || field == 'user_id') {
            resetAllTables()
            // val is fk
            getData(index_table[field], undefined, undefined, val, GET_FK).done((data) => {
                const {names, rows} = formatObjectData(data);
                for (let i = 0; i < rows.length; i++) {
                    tables[i] = new Table('#t' + (i + 1), names[i], rows[i], 50, true, onCellClicked)
                }
            })
        }
    }
}

// main
(function init() {
    $('#load_more1').click(() => {
        if (tables[0] != "") {
            tables[0].loadMore()
        }
    })
    $('#load_more2').click(() => {
        if (tables[1] != "") {
            tables[1].loadMore()
        }
    })
    // $('#load_more3').click(() => {
    //     if (tables[2] != "") {
    //         tables[2].loadMore()
    //     }
    // })
    $('#submit').click(function () {
        resetAllTables()
        let keywords = $('#keyword').val();
        getData(index_table[currDB], undefined, undefined, keywords, GET_SEARCH_RESULT).done((data) => {
            let {names, rows} = formatObjectData(data);
            for (let i = 0; i < rows.length; i++) {
                tables[i] = new Table('#t' + (i + 1), names[i], rows[i], 50, true, onCellClicked)
            }
            // map = new OLMap('map');
        })
    });

    // input change event listener
    $('#select_db input').on('change', function () {
        resetAllTables()
        currDB = $('input[name=db]:checked', '#select_db').val();

        // get default data
        if (currDB == 'world') {
            appendFilters();
            // ajax get data using RESTApi
            getData("country2", undefined, undefined, undefined, GET_DEFAULT).done((data) => {
                console.log(data)
                // conver data to list format [{d1},{d2}...]
                let dataInArray = Object.keys(data).map((key) => {
                    return data[key]
                })
                // render table based on data
                tables[0] = new Table('#t1', "country2", dataInArray, 50, false, onCellClicked);

            })
        } else if (currDB == 'world_restaurant') {
            appendFilters();
            // to do
        } else {
            
            appendFilters();
            let tableList = ['yelp_business', 'yelp_user']
            for (let i = 0; i < 3; i++){
                getData(tableList[i], undefined, undefined, undefined, GET_DEFAULT).done((data) => {
                    console.log(data)
                    let dataInArray = Object.keys(data).map((key) => {
                        return data[key]
                    })
                    // console.log(dataInArray)
                    tables[i] = new Table('#t' + (i + 1), tableList[i], dataInArray, 50, false, onCellClicked);
                })
            }
            
        }

    });
})();

function formatObjectData(data) {
    console.log(data)
    let obj = {}
    data.forEach((item, id) => {
        // console.log(item,id);
        let tbName = item[0];
        obj[tbName] ? obj[tbName].push(item[2]) : obj[tbName] = [item[2]]
    })
    console.log(obj)
    let allData = Object.values(obj)
    let tblNames = Object.keys(obj)
    return {
        names: tblNames,
        rows: allData
    };
}

function resetAllTables() {
    tables.forEach((item) => {
        item.destroy();
    })
}

function appendFilters() {
    $('#filter_options').empty();
    $('#filter_options').append('<p><b>Keyword Search: </b></p>');
    $('#filter_options').append('<input id="keyword" placeholder="Enter keywords here"></input>');
    $('#submit').css('display', 'block');
}
