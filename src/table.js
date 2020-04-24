import getData from './request'
import { GET_DEFAULT } from './request'
import '@fortawesome/fontawesome-free/css/all.css'


export let FK_COLUMN = {
    'Code': 1,
    'CountryCode': 1,
    'business_id': 1,
    'user_id': 1,
    'RestaurantId': 1,
    'CountryCode': 1
}

let TableOrder = {
    'country2': ['Code', 'Name', 'LocalName', 'HeadOfState', 'Region', 'Continent', 'IndepYear', 'Population', 'LifeExpectancy', 'SurfaceArea', 'GovernmentForm', 'GNP', 'GNPOld', 'Capital', 'Code2'],
    'city': ['CountryCode', 'Name', 'District', 'Population', 'ID'],
    'countrylanguage': ['CountryCode', 'Language', 'Percentage', 'IsOfficial'],
    'yelp_business': ['business_id', 'name', 'stars', 'city', 'state', 'address', 'postal_code', 'review_count', 'is_open', 'neighborhood', 'latitude', 'longitude', 'categories'],
    'yelp_user': ['user_id', 'name', 'yelp_since', 'review_count', 'average_stars', 'compliment_photos', 'useful', 'cool', 'fans', 'funny'],
    'yelp_tip': ['user_id', 'text', 'business_id', 'compliment_count', 'date'],
    'zomato_restaurant': ['RestaurantId', 'RestaurantName', 'City', ' Cuisines', 'PriceRange', 'AggregateRating', ' RatingColor', 'RatingText'],
    'zomato_country': ['CountryCode', 'Country'],
    'zomato_rc': ['RestaurantId', 'CountryCode']
}

export default class Table {
    constructor(id, table, data, pageSize = 50, searchingMode = false, onClickCb) {
        this.id = id;
        this.table = table;
        this.data = data;
        this.loadBtn = '#load_more' + id[id.length - 1];
        this.pageSize = pageSize;
        this.onClick = onClickCb;
        this.tableTitleId = this.id + "_name"
        // set table name
        $(this.tableTitleId).text(`Data from Table ${this.table}`);
        // set searching mode
        (searchingMode ?
            $(this.loadBtn).css('display', 'none') :
            $(this.loadBtn).css('display', 'block'))


        this.renderTable()
    }

    loadMore() {
        let count = this.data.length;
        console.log(count)
        getData(this.table, count, count + 50, undefined, GET_DEFAULT).done((res) => {

            let dataInArray = Object.keys(res).map((key) => {
                return res[key]
            })

            this.data = this.data.concat(dataInArray)
            if (count == this.data.length) {
                alert('There are no more data');
            }
            $(this.id).bootstrapTable('append', dataInArray)

        })
    }

    renderTable() {
        if (this.data != undefined) {
            let columns = [];

            $(this.id).empty();
            //  get headers and render headers with data-field set
            let headerItems = TableOrder[this.table];
            for (let i = 0; i < headerItems.length; i++) {
                columns.push({ field: headerItems[i], title: headerItems[i] });
            }
            // initialize table and render data section
            let height = 0;
            if (this.data.length < 10) {
                height = 0;
            } else if (this.data.length > 10 && this.data.length < 50) {
                height = 550;
            } else {
                height = 650;
            }

            $(this.id).bootstrapTable({
                detailView: true,
                detailViewIcon: true,
                columns: columns,
                data: this.data,
                pagination: true,
                height: height,
                pageSize: this.pageSize,
                headerStyle: (column) => {

                    if (FK_COLUMN[column.title]) {
                        return {
                            css: { 'font-weight': 'bold' },
                            classes: 'fk-col'
                        }
                    }
                    return {
                        css: { 'font-weight': 'bold', 'color': 'white' },
                    }

                },
                onExpandRow: (index, row, $detail) => {
                    let html = []
                    $.each(row, function (key, value) {
                        html.push('<p><b>' + key + ':</b> ' + value + '</p>')
                    })
                    $detail.append(html.join(' '))
                },
                // showToggle: true,
                onClickCell: (field, val) => {
                    this.onClick(field, val, this.table)
                }
            });
        } else {
            // this.destroy()
        }

    }


    destroy() {
        $(this.loadBtn).css('display', 'none');
        $(this.tableTitleId).empty();
        $(this.id).bootstrapTable('destroy');
        $(this.id).empty();
    }
}

