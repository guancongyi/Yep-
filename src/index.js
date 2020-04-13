
import 'jquery'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-table/dist/bootstrap-table.css'
import 'bootstrap-table/dist/bootstrap-table'
import Table from './table'
import getData from './request'

import '../assets/css/index.css'
// import Database from './firebase'
// import OLMap from './map'


const WORLD_CATEGORIES = 3;
const YELP_CATEGORIES = 2;
const WORLD_REST_CATEGORIES = 3;

// let map = new OLMap('map');
let currDB = 'world';
let table1 = "";


// main
(function init() {

    clearAndHideTables();

    $('#load_more1').click(()=>{
        if (table1 != "") {
            table1.loadMore()
        }
    })
    $('#submit').click(function () { submit() });

    // input change event listener
    $('#select_db input').on('change', function () {
        $('#t1').bootstrapTable('destroy');
        currDB = $('input[name=db]:checked', '#select_db').val();
        // get default data
        if (currDB == 'world') {
            appendWorldFilters();
            getData("country2").done((data) => {
                let dataInArray = Object.keys(data).map((key)=> {
                    return data[key]
                })
                // console.log(dataInArray)
                table1 = new Table('#t1',"country2" ,dataInArray);
                table1.renderTable();
            })


        } else if (currDB == 'world_restaurant') {
            // map.clearMap();
            appendWorldRestaurantFilters();
            clearAndHideTables();
            // to do
        } else {
            appendUsRestaurantFilters();
            getData("yelp_business").done((data) => {
                let dataInArray = Object.keys(data).map((key)=> {
                    return data[key]
                })
                console.log(dataInArray)
                table1 = new Table('#t1',"yelp_business" ,dataInArray);
                table1.renderTable();
            })


        }

    });
})();

// submit button clicked
function submit() {
    if (currDB == 'world') {
        let keyword = $('#keyword').val();
        database.getData(currDB, { 'keyword': keyword }).then((data) => {
            // console.log(data)
            if (data == 'null') {
                console.log('nulldatas')
                return;
            }
            let arr = Object.values(data)
            for (let i = 0; i < WORLD_CATEGORIES; i++) {
                if (arr[i].length == 0) { continue; }
                let id = "#t" + (i + 1);
                renderTable(id, arr[i])
            }
        });
    } else if (currDB == 'us_restaurant') {
        let keyword = $('#keyword').val();
        database.getData(currDB, { 'keyword': keyword }).then((data) => {
            if (data == null) {
                return;
            }
            // map.addMarker("",-118.286324, 34.020318)
            let arr = Object.values(data)
            for (let i = 0; i < YELP_CATEGORIES; i++) {
                if (arr[i].length == 0) continue;
                if (i == 0) { // business section

                    // each item in arr
                    for (let j = 0; j < arr[i].length; j++) {
                        // let name = arr[i][j].name;
                        map.addMarker("", arr[i][j].longitude, arr[i][j].latitude)
                        // console.log(long, lat)
                    }
                }
                let id = "#t" + (i + 1);
                console.log(arr[i])
                renderTable(id, arr[i])

            }
        });
    } else {

    }

};



function clearAndHideTables() {
    $('#t1').children("#tb_header").empty();
    $('#t1').children("#tb_body").empty();
    $('#t2').children("#tb_header").empty();
    $('#t2').children("#tb_body").empty();
    $('#t3').children("#tb_header").empty();
    $('#t3').children("#tb_body").empty();
    $('#t1').css('display', 'None');
    $('#t2').css('display', 'None');
    $('#t3').css('display', 'None');
}


function appendWorldFilters() {
    $('#filter_options').empty();
    $('#filter_options').append('<p><b>Keyword Search: </b></p>');
    $('#filter_options').append('<input id="keyword" placeholder="Enter keywords here"></input>');
    // $('#filter_options').append('<h1>World Filters</h1>');
    $('#submit').css('display', 'block');
}

function appendUsRestaurantFilters() {
    $('#filter_options').empty();
    // $('#filter_options').append('<h1>US Restaurant Filters</h1>');
    $('#filter_options').append('<p>Keyword Search: </p>');
    $('#filter_options').append('<input id="keywordBox" placeholder="Enter keywords here"></input>');
    // $('#filter_options').append('<h1>US Restaurant Filters</h1>');
    // $('#filter_options').append('<h1>US Restaurant Filters</h1>');
    // $('#filter_options').append('<h1>US Restaurant Filters</h1>');
    $('#submit').css('display', 'block');
}

function appendWorldRestaurantFilters() {
    $('#filter_options').empty();
    $('#filter_options').append('<h1>World Restaurant Filters</h1>');
    $('#filter_options').append('<h1>World Restaurant Filters</h1>');
    $('#filter_options').append('<h1>World Restaurant Filters</h1>');
    $('#filter_options').append('<h1>World Restaurant Filters</h1>');
    $('#submit').css('display', 'block');
}
