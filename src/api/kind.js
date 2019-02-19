import request from './request'

function getKindList(data){
    return request({
        method:'get',
        url:'api/admin/kind/list',
        data
    })
}

function saveKindeList(data){
    return request({
        method:'post',
        url:'api/admin/kind/save',
        data,
    })
}
function delKindList(data){
    return request({
        method:'get',
        url:'api/admin/kind/del',
        data,
    })
}
function upDataKindList(data){
    return request({
        method:'post',
        url:'api/admin/kind/update',
        data,
    })
}
export default({
    getKindList,
    saveKindeList,
    delKindList,
    upDataKindList
})