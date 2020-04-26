

let baseURL = 'https://inf551-d972f.firebaseio.com/'

export const GET_DEFAULT = 0;
export const GET_SEARCH_RESULT = 1;
export const GET_FK = 2;

export default function getData(table, start = 1, end = 50, searchTerm = "", mode) {
    let url = "";
    switch (mode) {
        case GET_DEFAULT:
            url = baseURL + table + ".json?"
            url += 'orderBy="$key"&' + `startAt="${start}"&` + `endAt="${end}"`
            break;
        case GET_SEARCH_RESULT:
            url = baseURL + table + "/";
            url += `${searchTerm}.json`
            break;
        case GET_FK:
            url = baseURL + table + "/" + searchTerm + ".json";
            break;
    }
    console.log(url)
    return $.get(url)

}