import DB from './firebase.js'
import Map from './map.js'

const WORLD_CATEGORIES = 3;
const YELP_CATEGORIES = 2;
const WORLD_REST_CATEGORIES = 3;

let database = new DB();
let map = new Map('map');
let currDB = 'world';

// submit button clicked
function submit(){
    if (currDB == 'world'){
        let keyword = $('#keyword').val();
        database.getData(currDB, {'keyword':keyword}).then((data)=>{
            // console.log(data)
            let arr = Object.values(data)
            for (let i = 0; i < WORLD_CATEGORIES; i++){
                if(arr[i].length ==0){continue;}
                let id = "#t"+(i+1);
                renderTable(id, arr[i])
            }
        });
    }else if(currDB == 'us_restaurant'){
        let keyword = $('#keyword').val();
        database.getData(currDB, {'keyword':keyword}).then((data)=>{
            
            let arr = Object.values(data)
            for (let i = 0; i < YELP_CATEGORIES; i++){
                if(arr[i].length == 0)continue;
                if (i == 0){ // business section
                    // each item in arr
                    for (let j =0; j<arr[i].length; j++){
                        let long = arr[i][j].longitude;
                        let lat = arr[i][j].latitude;
                        map.addMarker("", long,lat)
                        // console.log(long, lat)
                    }
                }
                let id = "#t"+(i+1);
                // console.log(arr)
                renderTable(id, arr[i])
                
            }
        });
    }else{

    }

};


// main
(function init(){
    
    clearAndHideTables();
    $('table').on('scroll', function () {
        $("#"+this.id+" > *").width($(this).width() + $(this).scrollLeft());
    });

    $('#submit').click(function(){submit()});
    
    // input change event listener
    $('#select_db input').on('change', function() {
        
        currDB = $('input[name=db]:checked', '#select_db').val();
        // get default data
        if(currDB == 'world'){
            map.clearMap();
            appendWorldFilters();
            // page=1, eachPage=50
            database.getData("country",null).then((data)=>{
                renderTable('#t1',data)
            })
        }else if (currDB == 'world_restaurant'){
            map.clearMap();
            appendWorldRestaurantFilters();

        }else{
            appendUsRestaurantFilters();
            map.showMap();
            // get default data
            database.getData("yelp_business",null).then((data)=>{
                renderTable('#t1',data)
            })
        }

    });
})();

function renderTable(id, data){

    let headerItems = Object.keys(data[0])
    $(id).children("#tb_header").empty();
    let res = "<tr>";
    for (let i = 0; i<headerItems.length;i++ ){
        res += "<th>"+headerItems[i]+"</th>";
    }
    res+="</tr>";
    $(id).children("#tb_header").append(res);


    $(id).children("#tb_body").empty();
    for (let i=0; i<data.length;i++){
        let dataItems = Object.values(data[i])
        res = "<tr>";
        for (let j =0 ; j< dataItems.length; j++){
            res += "<td>"+dataItems[j]+"</td>";
        }
        res+="</tr>";
        $(id).children("#tb_body").append(res);
        
    }
    showTable(id);
}


function clearAndHideTables(){
    $('#t1').children("#tb_header").empty();
    $('#t1').children("#tb_body").empty();
    $('#t2').children("#tb_header").empty();
    $('#t2').children("#tb_body").empty();
    $('#t3').children("#tb_header").empty();
    $('#t3').children("#tb_body").empty();
    $('#t1').css('display','None');
    $('#t2').css('display','None');
    $('#t3').css('display','None');
}

function showTable(id){
    $(id).css('display','block');
}

function appendWorldFilters(){
    $('#filter_options').empty();
    $('#filter_options').append('<p>Keyword Search: </p>');
    $('#filter_options').append('<input id="keyword" placeholder="Enter keywords here"></input>');
    // $('#filter_options').append('<h1>World Filters</h1>');
}

function appendUsRestaurantFilters(){
    $('#filter_options').empty();
    // $('#filter_options').append('<h1>US Restaurant Filters</h1>');
    $('#filter_options').append('<p>Keyword Search: </p>');
    $('#filter_options').append('<input id="keyword" placeholder="Enter keywords here"></input>');
    // $('#filter_options').append('<h1>US Restaurant Filters</h1>');
    // $('#filter_options').append('<h1>US Restaurant Filters</h1>');
    // $('#filter_options').append('<h1>US Restaurant Filters</h1>');
}

function appendWorldRestaurantFilters(){
    $('#filter_options').empty();
    $('#filter_options').append('<h1>World Restaurant Filters</h1>');
    $('#filter_options').append('<h1>World Restaurant Filters</h1>');
    $('#filter_options').append('<h1>World Restaurant Filters</h1>');
    $('#filter_options').append('<h1>World Restaurant Filters</h1>');
}
