import DB from './process.js'

let database = new DB();
let currDB = 'world';

// submit button clicked
function submit(){
    if (currDB == 'world'){
        let keyword = $('#keyword').val();

        database.getData(currDB, {'keyword':keyword}).then((data)=>{
            let arr = Object.values(data)
            for (let i = 0; i < arr.length; i++){
                if(arr[i].length ==0){continue;}
                console.log(arr[i])
                let id = "#t"+(i+1);
                console.log(id)
                fillTable(id, Object.keys(arr[i][0]), 1);
                for (let j = 0; j < arr[i].length; j++){
                    // console.log(Object.values(arr[i][j]))
                    fillTable(id, Object.values(arr[i][j]), 0)
                }
            }


        });
    }

};


// main
(function init(){
    $('table').on('scroll', function () {
        $("#"+this.id+" > *").width($(this).width() + $(this).scrollLeft());
    });

    $('#submit').click(function(){submit()});
    
    // input change event listener
    $('#select_db input').on('change', function() {

        currDB = $('input[name=db]:checked', '#select_db').val();
        if(currDB == 'world'){
            appendWorldFilters();
            // get default data
            database.getData("country",null).then((data)=>{
                fillTable("#t1", Object.keys(data[0]), 1);
                for (let i=0; i<data.length;i++){
                    fillTable("#t1", Object.values(data[i]), 0);
                }
            })

        }else if (currDB == 'world_restaurant'){
            appendWorldRestaurantFilters();

        }else{
            appendUsRestaurantFilters();
        }

    });
})();

function renderTable(id){

}

function fillTable(id, row, isHeader){
    let res = "<tr>"
    
    if (!isHeader){
        for (let i = 0; i<row.length;i++ ){
            res += "<td>"+row[i]+"</td>";
        }
        res+="</tr>";
        $(id).children("#tb_body").append(res)
        // console.log($(id).children("#body"))
        
    }else{

        $(id).children("#tb_header").empty();
        
        for (let i = 0; i<row.length;i++ ){
            res += "<th>"+row[i]+"</th>";
        }
        res+="</tr>";
        $(id).children("#tb_header").append(res);

    }
}

function appendWorldFilters(){
    $('#filter_options').empty();
    $('#filter_options').append('<p>Filters</p>');
    $('#filter_options').append('<input id="keyword" placeholder="Enter keywords here"></input>');
    // $('#filter_options').append('<h1>World Filters</h1>');
}

function appendUsRestaurantFilters(){
    $('#filter_options').empty();
    $('#filter_options').append('<h1>US Restaurant Filters</h1>');
    $('#filter_options').append('<h1>US Restaurant Filters</h1>');
    $('#filter_options').append('<h1>US Restaurant Filters</h1>');
    $('#filter_options').append('<h1>US Restaurant Filters</h1>');
}

function appendWorldRestaurantFilters(){
    $('#filter_options').empty();
    $('#filter_options').append('<h1>World Restaurant Filters</h1>');
    $('#filter_options').append('<h1>World Restaurant Filters</h1>');
    $('#filter_options').append('<h1>World Restaurant Filters</h1>');
    $('#filter_options').append('<h1>World Restaurant Filters</h1>');
}
