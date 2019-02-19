<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 基础表格</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                 <el-button type="primary" icon="add" class="handle-del mr10" @click="addGoods(false)">添加</el-button>
                <el-select v-model="select_cate" placeholder="筛选商品" class="handle-select mr10">
                    <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option>
                </el-select>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <span v-if="goodsList.totalRow">{{`当前共`+goodsList.totalRow+`条数据`}}</span>
            </div>
            <el-table
            :data="goodsList.list"
            @expand-change="expandChange"
            border
            style="width: 100%">
            <el-table-column type="expand">
            <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="商品ID :">
                    <span>{{ props.row.goods.id }}</span>
                </el-form-item>   
                <el-form-item label="卖出价格 :">
                    <span>{{ props.row.goods.priceOut }}</span>
                </el-form-item> 
                <el-form-item label="商品描述 :">
                    <span>{{ props.row.goods.desc }}</span>
                </el-form-item>
                <el-form-item label="进价 :">
                    <span>{{ props.row.goods.priceIn }}</span>
                </el-form-item> 
                <el-form-item label="商品数量 :">
                    <span>{{ props.row.goods.count }}</span>
                </el-form-item>  
                <el-form-item label="现价/打折 :">
                    <span>{{ props.row.goods.priceNow }}</span>
                </el-form-item>                          
                <el-form-item label="商品颜色 :">
                    <span class="color-span" :title="props.row.goods.color1" :style="{background:props.row.goods.color1}"></span>
                    <span class="color-span" :title="props.row.goods.color2" :style="{background:props.row.goods.color2}"></span>
                    <span class="color-span" :title="props.row.goods.color3" :style="{background:props.row.goods.color3}"></span>
                </el-form-item>
                <el-form-item label="商品型号 :">
                    <span class="span-size">{{ 'l : '+(props.row.goods.size_l==null||props.row.goods.size_l==0?'暂无商品':'有库存') }}</span>
                    <span class="span-size">{{ 'm : '+(props.row.goods.size_m==null||props.row.goods.size_m==0?'暂无商品':'有库存') }}</span>
                    <span class="span-size">{{ 's : '+(props.row.goods.size_s==null||props.row.goods.size_s==0?'暂无商品':'有库存') }}</span>
                </el-form-item>
                <el-form-item label="库存信息 :" v-for="subLists in props.row.subList" :key="subLists.id">
                    <span class="sub-list-span">{{'剩余库存 : '+subLists.count}}</span>
                    <span class="sub-list-span">颜色 : </span>
                    <span class="sub-list-span" :title="subLists.color" :style="{backgroundColor:subLists.color}"></span>
                    <span class="sub-list-span">{{'型号 : '+subLists.size}}</span>
                    <el-button type="text" icon="el-icon-edit" @click="addSon(subLists,false,false)">编辑</el-button>
                    <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(subLists.id)">删除</el-button>
                </el-form-item>

                </el-form>
                <el-button type="primary" class="tow-buttom" @click="addSon(props.row.goods,props.row.subList,true)">添加二级信息</el-button>
            </template>
            </el-table-column>
            <el-table-column label="日期" prop="goods.addTime">
                <template slot-scope="scope">
                    <span :style="{color:scope.row.goods.hot==1?'red':'gray'}">{{scope.row.goods.addTime}}</span>
                </template>
            </el-table-column>
            <el-table-column label="品牌" prop="goods.brandId">
                <template slot-scope="scope">
                    <span :style="{color:scope.row.goods.hot==1?'red':'gray'}">{{scope.row.goods.brandId}}</span>
                </template>
            </el-table-column>
            <el-table-column label="商品名称" prop="goods.name">
                <template slot-scope="scope">
                    <span :style="{color:scope.row.goods.hot==1?'red':'gray'}">{{scope.row.goods.name}}</span>
                </template>
            </el-table-column>
            <el-table-column label="hot" prop="goods.hot">
                <template slot-scope="scope">
                    <span :style="{color:scope.row.goods.hot==1?'red':'gray'}">{{scope.row.goods.hot==1?'热卖':'正常'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="商品图片" prop="goods.imgs">
                <template slot-scope="scope">
                    <img :src="'http://www.bufantec.com/'+scope.row.goods.img1" alt="" width="20%" height="50" margin-left="10px">
                    <img :src="'http://www.bufantec.com/'+scope.row.goods.img2" alt="" width="20%" height="50" margin-left="10px">
                    <img :src="'http://www.bufantec.com/'+scope.row.goods.img3" alt="" width="20%" height="50" margin-left="10px">
                    <img :src="'http://www.bufantec.com/'+scope.row.goods.img4" alt="" width="20%" height="50" margin-left="10px">
                </template>
            </el-table-column>  
            <el-table-column label="操作" width="180" align="center">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" @click="addGoods(scope.row.goods)">编辑</el-button>
                    <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row.goods.id,isDelGoods=true)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
            <div class="pagination">
                <el-pagination background layout="prev, pager, next, jumper" :total="goodsList.totalRow" @current-change="handleCurrentChange">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title="editTitle" :visible.sync="editVisible" width="60%" @close="cancelGoods('form')" :close-on-click-modal="!disabled" :close-on-press-escape="!disabled" :show-close="!disabled">
            <el-form ref="form" :rules="rules" :model="form" label-width="100px" v-loading="disabled" element-loading-text="拼命上传中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
                <el-form-item label="选择" prop="selectedOptions">
                    <el-cascader
                    expand-trigger="hover"
                    :options="optionsList"
                    v-model="selectedOptions"
                    @change="handleChange">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="品牌" size="medium" prop="brandId">
                    <el-input v-model="form.brandId"></el-input>
                </el-form-item>
                <el-form-item label="商品名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="商品描述" prop="desc">
                    <el-input v-model="form.desc"></el-input>
                </el-form-item>
                <el-form-item label="进价" prop="priceIn">
                    <el-input v-model="form.priceIn"></el-input>
                </el-form-item>
                <el-form-item label="原价" prop="priceOut">
                    <el-input v-model="form.priceOut"></el-input>
                </el-form-item>
                <el-form-item label="折扣价" prop="priceNow">
                    <el-input v-model="form.priceNow"></el-input>
                </el-form-item>
                <el-form-item label="商品热销" prop="hot">
                <template>
                    <el-radio-group v-model="form.hot">
                        <el-radio label="1">热销</el-radio>
                        <el-radio label="0">正常</el-radio>
                    </el-radio-group>
                </template>
                </el-form-item>
                <el-form-item label="商品颜色" prop="color1">
                    <el-input v-model="form.color1"></el-input>
                </el-form-item>
                <el-form-item label="商品颜色" prop="color2">
                    <el-input v-model="form.color2"></el-input>
                </el-form-item>
                <el-form-item label="商品颜色" prop="color3">
                    <el-input v-model="form.color3"></el-input>
                </el-form-item>
                <el-form-item label="商品s尺码" prop="size_s">
                    <el-radio-group v-model="form.size_s">
                        <el-radio label="1">有</el-radio>
                        <el-radio label="0">没有</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="商品m尺码" prop="size_m">
                    <el-radio-group v-model="form.size_m">
                        <el-radio label="1">有</el-radio>
                        <el-radio label="0">没有</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="商品l尺码" prop="size_l">
                    <el-radio-group v-model="form.size_l">
                        <el-radio label="1">有</el-radio>
                        <el-radio label="0">没有</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="商品照片" prop="img1">
                    <el-upload
                    ref = "myUpload1"
                    class="avatar-uploader"
                    action="http://www.bufantec.com/api/admin/upload"
                    drag
                    :on-success="returnImg1">
                        <img v-if="form.img1" width="100%" :src="'http://www.bufantec.com/'+form.img1" class="avatar">
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <el-upload
                    ref = "myUpload2"
                    class="avatar-uploader"
                    action="http://www.bufantec.com/api/admin/upload"
                    drag
                    :on-success="returnImg2">
                        <img v-if="form.img2" width="100%" :src="'http://www.bufantec.com/'+form.img2" class="avatar">
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <el-upload
                    ref = "myUpload3"
                    class="avatar-uploader"
                    action="http://www.bufantec.com/api/admin/upload"
                    drag
                    :on-success="returnImg3">
                        <img v-if="form.img3" width="100%" :src="'http://www.bufantec.com/'+form.img3" class="avatar">
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                 <div class="container">
                    <mavon-editor :autofocus="false" v-model="form.contentSource"  @change="change" style="min-height: 600px"/>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button :disabled="disabled" @click="cancelGoods('form')">取 消</el-button>
                <el-button :disabled="disabled" type="primary" @click="saveEdit('form')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 二级信息编辑弹出框 -->
        <el-dialog :title="editTitle" :visible.sync="editson" width="30%" @close="sonClose('goodsStock')" :show-close="!disabled" :close-on-press-escape="!disabled" :close-on-click-modal="!disabled">
            <el-form :rules="rules" :model="goodsStock" label-width="80px" v-loading="disabled" element-loading-text="数据拼命上传中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 251, 240, .2)" ref="goodsStock">
                <el-form-item label="颜色" prop="color">
                    <el-radio-group v-model="goodsStock.color">
                        <el-radio :label="form.color1" v-if="form.color1">{{form.color1}}</el-radio>
                        <el-radio :label="form.color2" v-if="form.color2">{{form.color2}}</el-radio>
                        <el-radio :label="form.color3" v-if="form.color3">{{form.color3}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="型号" prop="size">
                    <el-radio-group v-model="goodsStock.size">
                        <el-radio :label="form.size_s" v-if="form.size_s">S</el-radio>
                        <el-radio :label="form.size_m" v-if="form.size_m">M</el-radio>
                        <el-radio :label="form.size_l" v-if="form.size_l">L</el-radio>
                     </el-radio-group>
                </el-form-item>
                <el-form-item label="剩余库存" prop="count">
                    <el-input v-model="goodsStock.count"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button :disabled="disabled" @click="sonClose('goodsStock')">取 消</el-button>
                <el-button :disabled="disabled" type="primary" @click="sonSave('goodsStock')">确 定</el-button>
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
    import goodsList from '@/api/goods'
    import goodsKind from '@/api/kind'
    import { mavonEditor } from 'mavon-editor'
    import 'mavon-editor/dist/css/index.css'
    export default {
        name: 'basetable',
        components: {
            mavonEditor
        },
        data() {
            var colorPattern = /^#[0-9a-fA-F]{6}$/;
            var validateColor = (rule, value, callback) =>{
                if (!value) {
                    return callback(new Error('商品至少有一种颜色'));
                }
                if (value.match(colorPattern)==null) {
                    return callback(new Error('请输入十六进制颜色值'));
                } 
                callback();
            };
            var validateColors = (rule, value, callback) =>{
                if (!value) {
                    return callback();
                }
                if (value.match(colorPattern)==null) {
                    return callback(new Error('可以为空,如果输入:请输入十六进制颜色值'));
                } 
                callback();
            };
            var validateOptions = (rule, value, callback) =>{
                if(this.selectedOptions==0){
                    return callback(new Error('请至少选择一种分类'));
                }
                callback()
            };
            var validatePrice = (rule, value, callback) =>{
                var pricePatten = /(^[1-9]([0-9]+)?(\.[0-9]{1,4})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                if (!value) {
                    return callback(new Error('请输入价格'));
                }
                // value.match(countPatten)==null
                // pricePatten.test(value) === false  正则 test 验证
                if(pricePatten.test(value) === false){
                    return callback(new Error('请输入正确的数字价格'));
                }
                callback();
            };
            var validateCount = (rule, value, callback) =>{
                var countPatten = /^-?[1-9]\d*$/;
                if (!value) {
                    return callback(new Error('请输入数量'));
                }
                if(pricePatten.test(value) === false){
                    return callback(new Error('请输入正确的数字单位'));
                }
                callback();
            };
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


                form: {
                    id:'',
                    kindId:'',
                    brandId:'',
                    name: '',
                    desc:'',
                    priceIn:0,
                    priceOut:0,
                    priceNow:0,
                    hot:'',
                    img1:'',
                    img2:'',
                    img3:'',
                    color1:'',
                    color2:'',
                    color3:'',
                    size_s:-1,
                    size_m:-1,
                    size_l:-1,
                    contentSource:'',
                    content:'',
                },
                kindList:{},
                editTitle:'', // 弹窗标题
                goodsList:{},  // 当前表格数据载荷
                editVisible: false, // 一级弹窗开关
                editson:false,      // 二级弹窗开关
                delVisible: false, // 删除弹窗开关
                options:[],         // 级联选择器
                selectedOptions:[], // 级联选择器默认值
                isDelGoods:false,  // 判断一级弹窗/二级弹窗的删除
                delId:null, // 删除数据 api 传参荷载
                goodsStock:{    // 库存信息荷载
                    color:'',
                    size:'',
                    count:'',
                },
                isCascader:false, // 级联选择器判断是新增还是修改
                subList:[],  // 判断库存信息中是否有重复的信息
                disabled:false,  // loading动画是否开启
                rules:{
                    // 一级表单验证
                    selectedOptions:[
                        { validator: validateOptions , required: true, trigger: 'change' },
                    ],
                    brandId:[
                        { required: true, message: '请输入商品品牌', trigger: 'blur' },
                        { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
                    ],
                    name:[
                        { required: true, message: '请输入商品名称', trigger: 'blur' },
                        { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
                    ],
                    desc:[
                        { required: true, message: '请输入商品描述', trigger: 'blur' }
                    ],
                    priceIn:[
                        { validator: validatePrice,required: true, trigger: 'blur' },
                    ],
                    priceOut:[
                        { validator: validatePrice,required: true, trigger: 'blur' },
                    ],
                    priceNow:[
                        { validator: validatePrice,required: true, trigger: 'blur' },
                    ],
                    hot:[
                         { required: true, message: '商品是否热销', trigger: 'change' }
                    ],
                    color1:[
                        { validator: validateColor,required: true, trigger: 'blur' },
                    ],
                    color2:[
                        { validator: validateColors, trigger: 'blur' },
                    ],
                    color3:[
                        { validator: validateColors, trigger: 'blur' },
                    ],
                    size_s:[
                        { required: true, message: '请确定商品S号是否有库存', trigger: 'change' }
                    ],
                    size_m:[
                        { required: true, message: '请确定商品M号是否有库存', trigger: 'change' }
                    ],
                    size_l:[
                        { required: true, message: '请确定商品L号是否有库存', trigger: 'change' }
                    ],
                    img1:[
                        { required: true, message: '首张图片必须上传', trigger: 'change' }
                    ],
                    // 二级表单验证
                    color:[
                        { required: true, message: '请选择颜色', trigger: 'change' }
                    ],
                    size:[
                        { required: true, message: '请选择尺码', trigger: 'change' }
                    ],
                    count:[
                        { validator: validateCount, trigger: 'change' },
                    ]
                },
            }
        },
        created() {   
            this.getGoodsList();
            this.getKindList();
            // this.getData();
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
            },
            optionsList(){
                var options = [];
                for(var i = 0 ; i < this.kindList.length ; i++){
                    var children = this.kindList[i].list;
                    var obj = {};
                    obj.value = this.kindList[i].goodsKind.id;
                    obj.label = this.kindList[i].goodsKind.ctitle;
                    obj.children = [];
                    for(var j = 0 ; j < children.length ; j ++){
                        obj.children.push({
                            value:children[j].id,
                            label:children[j].ctitle
                        })
                    }
                    options.push(obj);
                }
                return options;
            },
        },
        methods: {
            // 打开弹窗
            addGoods(data){   
                if(data == false){
                    this.isCascader = false;
                    this.editTitle = '添加';
                    Object.assign(this.form,this.$options.data().form);
                    // console.log(this.form)
                }else{
                    this.editTitle = '编辑';
                    this.isCascader = true;
                    this.form = Object.assign({},data)
                    this.form.contentSource = this.form.contentSource==null?'':this.form.contentSource;
                    this.form.content = this.form.content==null?'':this.form.content;
                    delete(this.form['addTime','count'])        
                    console.log(this.form)
                }
                this.editVisible = true;
            },
            // 保存编辑
            saveEdit(form) {
                this.$refs[form].validate((valid) => {
                    if(valid){
                        this.disabled = true;
                        // 聪明的方法
                        var api = this.form.id?{
                            set:goodsList.upDataKindList,
                            message:'修改',
                        }:{
                            set:goodsList.setGoodsList,
                            message:'添加',
                        }
                        api.set({goods:this.form})
                        .then(res=>{
                            if(res.data.code == 'S'){
                                this.$message.success(`${api.message}成功`);
                                this.disabled = false;
                                this.editVisible = false;
                                this.getGoodsList();
                                this.$refs.myUpload1.clearFiles();
                                this.$refs.myUpload2.clearFiles();
                                this.$refs.myUpload3.clearFiles();
                            }
                        })
                        console.log(this.form)
                    } else {
                        this.$message.error('表单输入错误,请检查');
                        return false;
                    }
                    });               
                // 笨的方法
                // if(this.form.id){
                //     goodsList.upDataKindList({goods:this.form})
                //     .then(res=>{
                //         console.log(res)
                //         if(res.data.code == 'S'){
                //             this.$message.success('修改成功')
                //         }
                //     })
                // }else{            
                //     goodsList.setGoodsList({goods:this.form})
                //     .then(res=>{
                //         if(res.data.code == 'S'){
                //             this.$message.success('添加成功')
                //         }
                //     })
                // }
            },
            // goods弹窗取消事件
            cancelGoods(form){
                this.$refs[form].resetFields();
                this.editVisible = false;
            },
            // 此页面所有点击删除触发事件
            handleDelete(id){
                this.isDelGoods=false
                this.delId = id;
                this.delVisible = true;
            }, 
             // 确定删除
            deleteRow(){
                var api = this.isDelGoods?{
                    get:goodsList.delGoodsList,
                    message:'一级商品信息',
                }:{
                    get:goodsList.delStock,
                    message:'二级商品信息',
                }
                api.get({id:this.delId})
                .then(res=>{
                    // console.log(res)
                    if(res.data.code=='F' || res.data.code=='S'){
                        this.$message.success(`${api.message}删除成功`);
                        this.delVisible = false;
                        this.getGoodsList();
                    }
                })
            }, 
            // 点击二级添加/编辑
            addSon(data,subList,isAdd){
                if(isAdd){      
                    this.editTitle = '添加';         
                    Object.assign(this.$data.goodsStock,this.$options.data().goodsStock);
                    this.goodsStock.goodsId = data.id;
                    this.subList = subList;
                    // console.log(subList);
                    // console.log(this.goodsStock);
                }
                else{
                    this.editTitle = '修改';
                    this.goodsStock = Object.assign({},data)
                    // console.log(data);
                    delete(this.goodsStock['addTime']);
                }
                this.editson = true;
            },
            // 二级信息保存/编辑
            sonSave(goodsStock){
                this.$refs[goodsStock].validate((valid) => {
                    if (valid) {
                       this.disabled = true;
                        // 从添加二级信息按钮打开弹出层后,判断当前数据是否已经存在,如果存在,赋予存在的库存的id,进而变形为修改
                        for(var i = 0 ; i < this.subList.length ; i++){
                            if(this.goodsStock.color == this.subList[i].color && this.goodsStock.size == this.subList[i].size){
                                this.goodsStock.id = this.subList[i].id;
                            }
                        }
                        var api = this.goodsStock.id?{
                            set:goodsList.updateStock,
                            message:'修改成功',
                        }:{
                            set:goodsList.saveStock,
                            message:'添加成功',
                        }
                        setTimeout(()=>{
                            api.set({goodsStock:this.goodsStock})
                            .then(res=>{
                                if(res.data.code=='S'){
                                    this.$message.success(`二级信息${api.message}`);
                                    this.editson = false;
                                    this.getGoodsList();
                                    this.disabled = false;
                                }
                            })
                        },5000)
                    } else {
                        this.$message.error(`表单输入有误,请检查`);
                        return false;
                    }
                });               
            },
            // 二级信息弹窗关闭
            sonClose(goodsStock){
                this.editson = false;
                this.$refs[goodsStock].resetFields();
            },
            // 点击tab表格每一行展开,触发的回调
            expandChange(row,expandedRows){
                // row 当前行全部数据
                // expandedRows 展开行数据
                // 展开行时,获取数据,赋值给form
                this.form = Object.assign({},row.goods)
                this.form.size_l==1||this.form.size_l!=null?this.form.size_l='L':this.form.size_l=''
                this.form.size_s==1||this.form.size_s!=null?this.form.size_s='S':this.form.size_s=''
                this.form.size_m==1||this.form.size_m!=null?this.form.size_m='M':this.form.size_m=''
                // console.log(this.form)
            },
            // 页面打开时,created 钩子
            getGoodsList(index){
                //当前页面所需数据
                goodsList.getGoodsList(index==''?'':{start:index})
                .then(res=>{
                    console.log(res)
                    this.goodsList = res.data.data;
                    console.log(this.goodsList)                  
                })                        
            },
            getKindList(){
                goodsKind.getKindList()
                .then(res=>{
                    this.kindList = res.data.data;
                    console.log(this.kindList);
                })
            },  
             // markdown 相关
            change(value, render){
                // render 为 markdown 解析后的结果
                this.form.content = render;
                // console.log(value)
                // console.log(render)
            },
            // 上传照片
            returnImg1(response, file, fileList){
                this.form.img1 = response.data;
            },
            returnImg2(response, file, fileList){
                this.form.img2 = response.data;
            },
            returnImg3(response, file, fileList){
                this.form.img3 = response.data;
            },
            // 级联选择器选择点击后的回调,参数为选择的数据
            handleChange(value) {
                console.log(value)
                // this.form.kindId = value[value.length-1];
                // 这里如果要用pop,必须使用深拷贝,value是一个数组,pop会删除当前value 堆内存当中的数据
                this.form.kindId = value.slice(0).pop();
                // console.log(this.selectedOptions)
                console.log(this.form.kindId)
            },
            // 点击翻页器事件
            handleCurrentChange(val){
                // console.log(`当前页: ${val}`);
                this.getGoodsList(val);
            },










            // 分页导航
            // handleCurrentChange(val) {
            //     this.cur_page = val;
            //     this.getData();
            // },
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
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    name: item.name,
                    date: item.date,
                    address: item.address
                }
                this.editVisible = true;
            },
            // handleDelete(index, row) {
            //     this.idx = index;
            //     this.delVisible = true;
            // },
            delAll() {
                const length = this.multipleSelection.length;
                let str = '';
                this.del_list = this.del_list.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                }
                this.$message.error('删除了' + str);
                this.multipleSelection = [];
            },
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
.demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
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
    .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    height: 178px;
    display: block;
  }
    .color-span{
        display: inline-block;
        margin-left: 10px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
    }
    .span-size{
        display: inline-block;
        margin-left: 10px;
    }
    .tow-buttom{
        color: rgba(66, 158, 255, 1);
        background: rgba(64,158,255,.1);
        border: 1px solid rgba(64,158,255,.2)
    }
    .sub-list-span{
        display: inline-block;
        margin-left: 10px;
    }
    .sub-list-span:nth-child(3){
        margin-left: 5px;
        width: 15px;
        height: 15px;
        border-radius: 50%;
    }
    .sub-list-span:first-child{
        margin-left: 0;
    }
</style>
