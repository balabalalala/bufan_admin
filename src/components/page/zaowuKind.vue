<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>造物分类</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10">批量删除</el-button>
                <el-button type="primary" icon="add" class="handle-del mr10" @click="addKind(false,0)">增加</el-button>
                <!-- <el-select v-model="select_cate" placeholder="筛选分类" class="handle-select mr10">
                    <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option>
                </el-select>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button> -->
            </div>
            <el-table :data="kindList" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="goodsKind.addTime" label="添加日期" sortable width="150">
                </el-table-column>
                <el-table-column prop="goodsKind.ctitle" label="中文姓名">
                </el-table-column>
                <el-table-column prop="goodsKind.title" label="英文姓名" width="120" >
                </el-table-column>
                <el-table-column label="图片" width="120">
                    <template  slot-scope="scope">
                        <img :src="'http://www.bufantec.com/'+scope.row.goodsKind.img" alt="" width="100%">
                    </template>
                </el-table-column>
                <el-table-column prop="goodsKind.list" label="子集分类" width="350" >
                    <template slot-scope="scope">
                        <el-tag
                            v-for="list in scope.row.list"
                            :key="list.id"
                            closable
                            :type="list.type"
                            @click.native="addKind(list,scope.row.goodsKind.id)"
                            @close="twoClose(list)">
                            {{list.ctitle}}
                        </el-tag>
                        <el-button class="button-new-tag" size="small" @click="addKind(false,scope.row.goodsKind.id)">+ 添加一个子分类</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="addKind(scope.row.goodsKind,0)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row.goodsKind.id,0)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="1000">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title="editTitle" :visible.sync="editVisible" width="30%" @close="editVisible = false,imgShow=false">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="中文名字" width="80">
                    <el-input v-model="form.ctitle"></el-input>
                </el-form-item>
                <el-form-item label="英文名字">
                    <el-input v-model="form.title" width="80"></el-input>
                </el-form-item>
                <el-upload
                    ref = "myUpload"
                    align="center"
                    action="http://www.bufantec.com/api/admin/upload"
                    drag
                    :limit="1"
                    v-show="imgShow"
                    :on-exceed="exceedImg"
                    :on-success='returnImg'
                    >
                    <img width="100%" height="100%" :src="'http://www.bufantec.com/'+form.img" alt="">
                    <i class="el-icon-plus"></i>
                </el-upload>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import bfApi from '@/api/kind.js'
    export default {
        name: 'basetable',
        data() {
            return {
                url: './vuetable.json',
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                // editVisible: false,
                // delVisible: false,
                // form: {
                //     name: '',
                //     date: '',
                //     address: ''
                // },
                idx: -1,





                kindList:[],
                form: {
                    title: '',
                    ctitle: '',
                    img:'',
                },
                imgShow:true,
                editTitle:'',
                editVisible:false,
                delVisible: false,
                del_id: null,
                del_type: null,
            }
        },
        created() {
            this.goodsKind();

            this.getData();
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    let is_del = false;
                    for (let i = 0; i < this.del_list.length; i++) {
                        if (d.name === this.del_list[i].name) {
                            is_del = true;
                            break;
                        }
                    }
                    if (!is_del) {
                        if (d.address.indexOf(this.select_cate) > -1 &&
                            (d.name.indexOf(this.select_word) > -1 ||
                                d.address.indexOf(this.select_word) > -1)
                        ) {
                            return d;
                        }
                    }
                })
            }
        },
        methods: {
            // 增加/编辑
            addKind(data,pid){
                // console.log(data)
                if(data!=false){
                    // console.log(data)
                    this.editTitle = '编辑';
                    this.form = Object.assign({},data)
                    // this.form = data.goodsKind;
                }else{
                    this.editTitle = '增加';
                    Object.assign(this.$data.form,this.$options.data().form)
                    // console.log(this.$data.form)
                }
                this.imgShow = true;
                if(pid != 0 ){
                    this.imgShow = false
                }
                console.log(this.imgShow)
                this.form.pid = pid;
                this.editVisible=true;
            },
            // 保存增加/保存编辑
            saveEdit() {
                if(this.form.id){
                    bfApi.upDataKindList({goodsKind:this.form})
                    .then(res=>{
                        if(res.data.code === 'S'){
                            this.$message.success('修改成功')
                        }
                    })
                }else{
                    bfApi.saveKindeList({goodsKind:this.form})
                    .then(res=>{
                        if(res.data.code === 'S'){
                            this.$message.success('添加成功')
                        }
                    });
                }
                this.$refs.myUpload.clearFiles();
                this.editVisible = false;
                this.goodsKind();
            },
            // 点击删除
            handleDelete(id,type) {
                this.delVisible = true;
                this.del_id = id;
                this.del_type = type;
            },
            // 确定删除
            deleteRow(){
                bfApi.delKindList({id:this.del_id,type:this.del_type})
                .then(res=>{
                    if(res.data.code === 'S'){
                        this.$message.success('删除成功');
                    }
                })
                this.delVisible = false;
                this.goodsKind();
            },
            // 二级标签删除
            twoClose(list) {
                console.log(list)
                this.delVisible = true;
                this.del_id = list.id;
                this.del_type = 1;
            },
            // 照片上传成功
            returnImg(response, file, fileList){
                this.form.img = response.data;
                console.log(response)
                console.log(file)
                console.log(fileList)
                console.log(this.form.img)
            },
            // 上传照片超出
            exceedImg(files, fileList){
                this.$message.error('上传照片超出限制');
            },
            goodsKind(){              
                bfApi.getKindList()
                .then(res=>{
                    this.kindList = res.data.data;
                    // console.log(this.kindList);
                })
            },














            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
                if (process.env.NODE_ENV === 'development') {
                    this.url = '/ms/table/list';
                };
                this.$axios.post(this.url, {
                    page: this.cur_page
                }).then((res) => {
                    this.tableData = res.data.list;
                })
            },
            search() {
                this.is_search = true;
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            // handleEdit(index, row) {
            //     this.idx = index;
            //     const item = this.tableData[index];
            //     this.form = {
            //         name: item.name,
            //         date: item.date,
            //         address: item.address
            //     }
            //     this.editVisible = true;
            // },
            // handleDelete(index, row) {
            //     this.idx = index;
            //     this.delVisible = true;
            // },
            // delAll() {
            //     const length = this.multipleSelection.length;
            //     let str = '';
            //     this.del_list = this.del_list.concat(this.multipleSelection);
            //     for (let i = 0; i < length; i++) {
            //         str += this.multipleSelection[i].name + ' ';
            //     }
            //     this.$message.error('删除了' + str);
            //     this.multipleSelection = [];
            // },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // // 保存编辑
            // saveEdit() {
            //     this.$set(this.tableData, this.idx, this.form);
            //     this.editVisible = false;
            //     this.$message.success(`修改第 ${this.idx+1} 行成功`);
            // },
            // // 确定删除
            // deleteRow(){
            //     this.tableData.splice(this.idx, 1);
            //     this.$message.success('删除成功');
            //     this.delVisible = false;
            // }
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
    .mr10{
        margin-right: 10px;
    }
</style>
