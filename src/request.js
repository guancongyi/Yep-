let baseURL = 'https://inf551-d972f.firebaseio.com/'

export default function getData(table, start=1, end=50, searchTerm="") {
    let url = baseURL + table +".json?"
    if (searchTerm == ""){
        url += 'orderBy="$key"&'+`startAt="${start}"&`+`endAt="${end}"`
    }else{

    }
    
    return $.get(url)
}