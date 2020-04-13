import getData from './request'

export default class Table{
    constructor(id,table, data, pageSize=50){
        
        this.id = id;
        this.table = table;
        this.data = data;
        this.loadBtn = '#load_more';
        this.pageSize = pageSize;
    }

    loadMore(){
        let count = this.data.length;
        console.log(count)
        getData(this.table, count, count+50).done((res) => {
            let dataInArray = Object.keys(res).map((key)=> {
                return res[key]
            })
            
            this.data = this.data.concat(dataInArray)
            if(count == this.data.length){
                alert('There are no more data');
            }
            $(this.id).bootstrapTable('append', dataInArray)

        })
    }

    renderTable() {
        //  get headers and render headers with data-field set
        let headerItems = Object.keys(this.data[0]);
        console.log(headerItems)
        $(this.id).children("#tb_header").empty();
        let res = "<tr>";
        for (let i = 0; i < headerItems.length; i++) {
            res += `<th data-field="${headerItems[i]}">` + headerItems[i] + "</th>";
        }
        res += "</tr>";
        $(this.id).children("#tb_header").append(res);
        
        // initialize table and render data section
        $(this.id).bootstrapTable({
            data: this.data,
            pagination: true,
            pageSize:this.pageSize,
            onClickCell: (field, val,row, elem)=>{
                this.onCellClicked(field, val,row, elem)
            }
        });

        $(this.id).css('display', 'block');
    }
    onCellClicked(field, val,row, elem) {
        alert(val) 
    }
}