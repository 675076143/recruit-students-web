<template>
    <div class="data">
        <Card>
            <p slot="title" style="text-align: left">
                <Icon type="ios-contact" />
                数据录入
            </p>
            <div class="card-extra" slot="extra">
                <input type="file" @change="loadFile($event)" style="width: 320px;"
                       accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
                <span>错误数:{{errorNum}}</span>
                <Button type="success" :style="{display:uploadBtn}" @click="uploadData" icon="md-cloud-upload">上传</Button>
            </div>

            <Table style="height: 100%" :row-class-name="rowClassName" border :columns="columns" :data="data" />
        </Card>
        <Modal
                v-model="modalEdit"
                title="修改数据"
                @on-ok="editData"
                @on-cancel="cancel">
            <Form :model="modalEditData" :label-width="80">
                <FormItem label="学号">
                    <Input v-model="modalEditData.学号" />
                </FormItem>
                <FormItem label="语文">
                    <InputNumber v-model="modalEditData.语文" :max="100" :min="0"></InputNumber>
                </FormItem>
                <FormItem label="数学">
                    <InputNumber v-model="modalEditData.数学" :max="100" :min="0"></InputNumber>
                </FormItem>
                <FormItem label="英语">
                    <InputNumber v-model="modalEditData.英语" :max="100" :min="0"></InputNumber>
                </FormItem>
                <FormItem label="总分">
                    <InputNumber v-model="totalScore" :max="300" :min="0" disabled></InputNumber>
                </FormItem>
            </Form>

        </Modal>
    </div>
</template>
<style lang="less">
    .data{
        .card-extra{
            display: flex;
            align-items: center;
            input[type=file]{
                width: 180px!important;
            }
            span{
                margin: 0 10px;
            }
        }
    }

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
    import {validateScore} from "../util/validateUtils";

    var excelData;
    import XLSX from 'xlsx'
    import {reqInsertScore} from "../api";

    export default {
        name: "Data",
        computed:{
            /**
             * 如果无错误，显示上传按钮
            * */
            uploadBtn(){
                return this.errorNum===0&&this.data.length!=0?'block':'none'
            },
            totalScore(){
                return this.modalEditData.语文+this.modalEditData.数学+this.modalEditData.英语
            }
        },
        methods:{
            /**
             * 载入EXCEL数据
             * @param e
             */
            loadFile(e) {
                const obj = e.currentTarget
                console.log(obj)
                console.log('obj')
                if (!obj.files) {
                    return;
                }
                const file = obj.files[0];
                const reader = new FileReader();
                const that = this
                reader.onload = function (e) {
                    const data = e.target.result;
                    excelData = XLSX.read(data, {
                        type: 'binary'
                    });
                    //excelData.SheetNames[0]是获取Sheets中第一个Sheet的名字
                    //excelData.Sheets[Sheet名]获取第一个Sheet的数据
                    const json = XLSX.utils.sheet_to_json(excelData.Sheets[excelData.SheetNames[0]]);
                    console.log(json)
                    //初始化columns的数据
                    that.columns = []
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
                                                that.show(params.index)
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
                                                that.remove(params.index)
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
            },
            /**
             * 为表格行添加样式
             * @param row
             * @param index
             * @returns {string}
             */
            rowClassName (row, index) {
                if(!validateScore(row.学号,row.语文,row.数学,row.英语,row.总分)){
                    return 'demo-table-error-row';
                }
                this.getErrorNum()
                return '';
            },
            /**
             * 获取错误数
             */
            getErrorNum(){
                const errorRow = document.querySelectorAll('.demo-table-error-row')
                this.errorNum = errorRow.length
            },
            remove (index) {
                this.data.splice(index, 1);
            },
            show (index) {
                this.modalEdit=true
                const data = this.data[index]
                this.modalEditData = {...data}
                this.editIndex = index
            },
            async uploadData(){
                const result = await reqInsertScore(this.data,this)
                console.log(result)
                if(result.code==="200"){
                    this.$Message.success(result.message)
                }else {
                    this.$Message.error(result.message)
                }
            },
            cancel () {
                this.$Message.info('Clicked cancel');
                this.modalEditData=[]

            },
            editData(){
                const {editIndex} = this
                this.modalEditData.总分 = this.totalScore
                this.data.splice(editIndex,1,this.modalEditData)
            }
        },
        data(){
            return{
                columns: [],
                data: [],
                errorNum:0,
                modalEdit:false,
                modalEditData:{},
                editIndex:-1
            }
        }
    }
</script>

