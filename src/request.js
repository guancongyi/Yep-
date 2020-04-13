let baseURL = 'https://inf551-d972f.firebaseio.com/'

export default function getData(table, start=1, end=50, searchTerms="") {
    let url = ""
    if (searchTerms == ""){
        url = baseURL + table +".json?"
        url += 'orderBy="$key"&'+`startAt="${start}"&`+`endAt="${end}"`
    }else{
        url = baseURL + table +"/"
        // parse the string
        let words = searchTerms.toLowerCase().split(' ');
        console.log(words)
        for(let i = 0; i< words.length; i++){
            if (/\d/.test(words[i])) continue;
            else{
                console.log(words[i])
                url += `${words[i]}.json`
            }
        }

    }
    console.log(url)
    return $.get(url)
}