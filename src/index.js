import 'jquery'
import img from '../assets/img/sun.png';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-table/dist/bootstrap-table.css'
import 'bootstrap-table/dist/bootstrap-table'
import { MaxHeap } from '@datastructures-js/heap'
import Table from './table'
import { GET_DEFAULT, GET_FK, GET_SEARCH_RESULT } from './request'
import getData from './request'

import '../assets/css/index.css'
import OLMap from './map'

let index_table = {
    'world': 'world_index',
    'us_restaurant': 'yelp_index',
    'business_id': 'yelp_bid_index',
    'user_id': 'yelp_uid_index',
    'RestaurantId': 'zomato_rest_fk',
    'CountryCode': 'zomato_country_fk',
    'world_restaurant': 'zomato_index'
}


let currDB = "";
let tables = new Array(3);


// Navigation
function onCellClicked(field, val, tb) {
    if (tb == 'city' || tb == 'country2' || tb == 'countrylanguage') {
        if (field == 'Code' || field == 'CountryCode') {
            resetAllTables()
            getData(index_table['world'], undefined, undefined, val, GET_SEARCH_RESULT).done((data) => {
                const { names, rows } = formatObjectData(data);
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
                const { names, rows } = formatObjectData(data);
                for (let i = 0; i < rows.length; i++) {
                    tables[i] = new Table('#t' + (i + 1), names[i], rows[i], 50, true, onCellClicked)
                }
            })
        }
    } else if (tb == 'zomato_restaurant' || tb == 'zomato_country' || tb == 'zomato_rc') {
        if (field == 'RestaurantId' || field == 'CountryCode') {
            resetAllTables()
            getData(index_table[field], undefined, undefined, val, GET_FK).done((data) => {
                const { names, rows } = formatObjectData(data);
                for (let i = 0; i < rows.length; i++) {
                    tables[i] = new Table('#t' + (i + 1), names[i], rows[i], 50, true, onCellClicked)
                }
            })
        }
    }
}

// Search
function submit() {
    resetAllTables()
    let keywords = $('#keyword').val().split(' ');
    // store all promises in an array
    let allProm = new Array(keywords.length);
    for (let i = 0; i < keywords.length; i++) {
        let word = keywords[i].toLowerCase();
        allProm[i] = getData(index_table[currDB], undefined, undefined, word, GET_SEARCH_RESULT)
    }

    Promise.all(allProm).then(data => {
        // make one
        let dataInOne = []
        for (let i = 0; i < data.length; i++) {
            Array.prototype.push.apply(dataInOne, data[i])
        }

        // sort data based on their categories,
        let categories = {}
        dataInOne.forEach((item, id) => {
            // console.log(item,id);
            let tbName = item[0];
            categories[tbName] ? categories[tbName].push(item) : categories[tbName] = [item]
        })
        console.log(Object.entries(categories))

        // and for each categories sort them based on the occurances
        // then store them in heap
        let dataInCate = []
        for (let category in categories) {
            console.log(category)
            let cateDatas = categories[category];
            let dict = {};
            for (let i = 0; i < cateDatas.length; i++) {
                let strK = JSON.stringify(cateDatas[i][2])
                if (dict[strK] == undefined) {
                    dict[strK] = 1
                } else {
                    dict[strK] += 1
                }
            }
            console.log(dict)
            // use Heap to sort them
            let maxHeap = new MaxHeap()
            for (let [k, v] of Object.entries(dict)) {
                maxHeap.insert(v, k)
            }

            let temp = []
            while (maxHeap.size() != 0) {
                temp.push(JSON.parse(maxHeap.extractRoot().getValue()))
            }
            dataInCate.push(temp)
        }

        console.log(dataInCate)

        for (let i = 0; i < dataInCate.length; i++) {
            tables[i] = new Table('#t' + (i + 1), Object.keys(categories)[i], dataInCate[i], 50, true, onCellClicked)
        }
    })

}


// Main
(function init() {
    var homeImg = $('#header-img');
    homeImg.attr('src', img)

    $('#load_more1, #load_more2, #load_more3').click((event) => {
        let tid = parseInt(event.currentTarget.value);
        if (tables[tid] != "") {
            tables[tid].loadMore();
        }
    });

    $('#keyword').on('keydown', (e) => {
        if (e.which == 13) {
            submit();
        }
    })

    $('#submit').click(() => {
        submit();
    })

    // input change event listener
    $('#select_db input').on('change', function () {
        toggleMap(0)
        resetAllTables()
        currDB = $('input[name=db]:checked', '#select_db').val();
        console.log(currDB)
        // get default data
        if (currDB == 'world') {
            appendFilters();
            // ajax get data using RESTApi
            let tableList = ['country2', 'city', 'countrylanguage']
            for (let i = 0; i < tableList.length; i++) {
                getData(tableList[i], undefined, undefined, undefined, GET_DEFAULT).done((data) => {
                    let dataInArray = Object.keys(data).map((key) => {
                        return data[key]
                    })
                    tables[i] = new Table('#t' + (i + 1), tableList[i], dataInArray, 50, false, onCellClicked);
                })
            }
        } else if (currDB == 'world_restaurant') {
            appendFilters();
            let tableList = ['zomato_restaurant', 'zomato_country', 'zomato_rc']
            for (let i = 0; i < tableList.length; i++) {
                getData(tableList[i], undefined, undefined, undefined, GET_DEFAULT).done((data) => {
                    let dataInArray = Object.keys(data).map((key) => {
                        return data[key]
                    })
                    tables[i] = new Table('#t' + (i + 1), tableList[i], dataInArray, 50, false, onCellClicked);
                })
            }
        } else {
            toggleMap(1);
            // get user's location
            getLocation().then((loc) => {
                appendFilters();
                console.log(loc)
                let map = new OLMap('map');
                map.addMarker("", loc[0],loc[1],12)

                let tableList = ['yelp_business', 'yelp_user']
                for (let i = 0; i < tableList.length; i++) {
                    getData(tableList[i], undefined, undefined, undefined, GET_DEFAULT).done((data) => {
                        let dataInArray = Object.keys(data).map((key) => {
                            return data[key]
                        })
                        tables[i] = new Table('#t' + (i + 1), tableList[i], dataInArray, 50, false, onCellClicked);
                    })
                }
            })
            
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

function toggleMap(status) {
    if (status) {
        $('#map').css('display', 'block')
    } else {
        $('#map').css('display', 'none')
    }
}


function getLocation() {

        if (navigator.geolocation) {
            return new Promise((resolve) => {
                navigator.geolocation.getCurrentPosition((position) => {
                    resolve([position.coords.longitude,position.coords.latitude])
                });
            })
        } else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
    
    
}

function appendFilters() {
    $('#filter_options').empty();
    $('#filter_options').append('<p>Keyword Search: </p>');
    $('#keyword').css('display', 'block');
    $('#submit').css('display', 'block');
}
