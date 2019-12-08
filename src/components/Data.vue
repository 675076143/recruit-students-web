<template>
    <div class="data">
        <Card>
            <p slot="title" style="text-align: left">
                <Icon type="ios-contact" />
                数据录入
            </p>
            <div slot="extra">
                <input type="file" @change="uploadFile($event)" style="width: 320px;"
                       accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
                <span>错误数:{{errorNum}}</span>
            </div>


            <Table :row-class-name="rowClassName" border :columns="columns" :data="data" />
        </Card>
    </div>
</template>
<style>
    .ivu-table .demo-table-info-row td{
        background-color: #2db7f5;
        color: #fff;
    }
    .ivu-table .demo-table-error-row td{
        background-color: #ff6600;
        color: #fff;
    }
    .ivu-table td.demo-table-info-column{
        background-color: #2db7f5;
        color: #fff;
    }
    .ivu-table .demo-table-info-cell-name {
        background-color: #2db7f5;
        color: #fff;
    }
    .ivu-table .demo-table-info-cell-age {
        background-color: #ff6600;
        color: #fff;
    }
    .ivu-table .demo-table-info-cell-address {
        background-color: #187;
        color: #fff;
    }
</style>

<script>
    var excelData;
    import XLSX from 'xlsx'

    export default {
        name: "Data",
        methods:{
            getErrorNum(){
                const errorRow = document.querySelectorAll('.demo-table-error-row')
                this.errorNum = errorRow.length
            },
            rowClassName (row, index) {
                if (row.学号 === undefined) {
                    return 'demo-table-error-row';
                }
                this.getErrorNum()
                return '';
            },
            uploadFile(e) {
                const obj = e.currentTarget
                console.log(obj)
                console.log('obj')
                if (!obj.files) {
                    return;
                }
                var file = obj.files[0];
                var reader = new FileReader();
                const that = this
                reader.onload = function (e) {
                    var data = e.target.result;
                    excelData = XLSX.read(data, {
                        type: 'binary'
                    });
                    //excelData.SheetNames[0]是获取Sheets中第一个Sheet的名字
                    //excelData.Sheets[Sheet名]获取第一个Sheet的数据
                    var json = XLSX.utils.sheet_to_json(excelData.Sheets[excelData.SheetNames[0]]);
                    console.log(json)
                    //把第一条数据的列名作为key存到table的columns中
                    for (let key in json[0]){
                        console.log(that.columns)
                        that.columns.push({
                            title:key,
                            key,
                        })
                    }
                    that.columns.push(
                        {
                            title: 'Action',
                            key: 'action',
                            align: 'center',
                            render: (h, params) => {
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                this.show(params.index)
                                            }
                                        }
                                    }, 'Edit'),
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                this.remove(params.index)
                                            }
                                        }
                                    }, 'Delete')
                                ]);
                            }
                        },
                    )
                    that.data = json


                };
                reader.readAsBinaryString(file);
            }
        },
        data(){
            return{
                columns: [],
                data: [],
                errorNum:0
            }
        }
    }
</script>

