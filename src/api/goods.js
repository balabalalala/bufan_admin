import request from './request'
function getGoodsList (data){
    return request({
        method:'get',
        url:'api/admin/goods/list',
        data
    })
}
function setGoodsList(data){
    return request({
        method:'post',
        url:'api/admin/goods/save',
        data
    })
}
function delGoodsList(data){
    return request({
        method:'get',
        url:'api/admin/goods/del',
        data
    })
}
function upDataKindList(data){
    return request({
        method:'post',
        url:'api/admin/goods/update',
        data
    })
}
function stockList(data){
    return request({
        method:'post',
        url:'api/admin/goods/stockList',
        data
    })
}
function saveStock(data){
    return request({
        method:'post',
        url:'api/admin/goods/saveStock',
        data
    })
}
function updateStock(data){
    return request({
        method:'post',
        url:'api/admin/goods/updateStock',
        data
    })
}
function delStock(data){
    return request({
        method:'get',
        url:'api/admin/goods/delStock',
        data
    })
}


export default({
    getGoodsList,
    setGoodsList,
    delGoodsList,
    upDataKindList,
    stockList,
    saveStock,
    updateStock,
    delStock,
})