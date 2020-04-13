import getData from './request'

export default class Table {
    constructor(id, table, data, pageSize = 50, searchingMode = false) {
        this.id = id;
        this.table = table;
        this.data = data;
        this.loadBtn = '#load_more' + id[id.length - 1];
        this.pageSize = pageSize;

        (searchingMode ?
            $(this.loadBtn).css('display', 'none') :
            $(this.loadBtn).css('display', 'block'))
        this.renderTable()
    }

    loadMore() {
        let count = this.data.length;
        console.log(count)
        getData(this.table, count, count + 50).done((res) => {
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
            //  get headers and render headers with data-field set
            let headerItems = Object.keys(this.data[0]);
            $(this.id).children("#tb_header").empty();
            let res = "<tr>";
            for (let i = 0; i < headerItems.length; i++) {
                res += `<th data-field="${headerItems[i]}">` + headerItems[i] + "</th>";
            }
            res += "</tr>";
            $(this.id).children("#tb_header").append(res);

            // initialize table and render data section

            let height = 0;
            if (this.data.length < 10){
                height = 0;
            }else if(this.data.length > 10 && this.data.length < 50){
                height = 550;
            }else{
                height = 650;
            }

            $(this.id).bootstrapTable({
                data: this.data,
                pagination: true,
                height: height,
                pageSize: this.pageSize,
                // showToggle: true,
                onClickCell: (field, val, row, elem) => {
                    this.onCellClicked(field, val, row, elem)
                }
            });
        }else{
            // this.destroy()
        }

    }
    onCellClicked(field, val, row, elem) {
        alert(val)
    }

    destroy() {
        console.log(this.id)
        $(this.id).children("#tb_header").empty();
        $(this.id).bootstrapTable('destroy');
    }
}